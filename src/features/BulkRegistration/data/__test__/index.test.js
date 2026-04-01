import { validateCSVFile } from 'helpers';
import { uploadCSV } from 'features/BulkRegistration/data';
import { postBulkRegister } from 'features/BulkRegistration/data/api';
import { BULK_REGISTRATION_STATES } from 'features/constants';

jest.mock('helpers', () => ({
  validateCSVFile: jest.fn(),
}));

jest.mock('features/BulkRegistration/data/api', () => ({
  postBulkRegister: jest.fn(),
}));

const makeFile = (name = 'students.csv') => new File([''], name, { type: 'text/csv' });

const makeApiResponse = (summary = {}, rows = []) => ({
  data: {
    errors: {
      summary: {
        total_rows: '0', created: '0', existed: '0', failed: '0', ...summary,
      },
      rows,
    },
  },
});

const makeApiRow = (overrides = {}) => ({
  row_number: '2',
  email: 'user@example.com',
  status: 'Validation failed',
  errors: { email: ['This field is required'] },
  ...overrides,
});

beforeEach(() => {
  validateCSVFile.mockResolvedValue(undefined);
  postBulkRegister.mockResolvedValue(makeApiResponse());
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('uploadCSV — happy path', () => {
  test('Should call validateCSVFile with the provided file', async () => {
    const file = makeFile();
    await uploadCSV(file);
    expect(validateCSVFile).toHaveBeenCalledWith(file);
  });

  test('Should call postBulkRegister with the provided file', async () => {
    const file = makeFile();
    await uploadCSV(file);
    expect(postBulkRegister).toHaveBeenCalledWith(file);
  });

  test('Should return SUCCESS_ALL when there are no failures or existing users', async () => {
    postBulkRegister.mockResolvedValue(
      makeApiResponse({
        total_rows: '5', created: '5', existed: '0', failed: '0',
      }),
    );

    const result = await uploadCSV(makeFile());

    expect(result.type).toBe(BULK_REGISTRATION_STATES.SUCCESS_ALL);
  });

  test('Should return totalRegistered from created when SUCCESS_ALL', async () => {
    postBulkRegister.mockResolvedValue(
      makeApiResponse({
        total_rows: '5', created: '5', existed: '0', failed: '0',
      }),
    );

    const result = await uploadCSV(makeFile());

    expect(result.totalRegistered).toBe(5);
  });

  test('Should fall back to total_rows for totalRegistered when created is 0', async () => {
    postBulkRegister.mockResolvedValue(
      makeApiResponse({
        total_rows: '3', created: '0', existed: '0', failed: '0',
      }),
    );

    const result = await uploadCSV(makeFile());

    expect(result.totalRegistered).toBe(3);
  });

  test('Should return SUCCESS_PARTIAL when some users already existed', async () => {
    postBulkRegister.mockResolvedValue(
      makeApiResponse({
        total_rows: '8', created: '6', existed: '2', failed: '0',
      }),
    );

    const result = await uploadCSV(makeFile());

    expect(result.type).toBe(BULK_REGISTRATION_STATES.SUCCESS_PARTIAL);
  });

  test('Should return correct numeric stats for SUCCESS_PARTIAL', async () => {
    postBulkRegister.mockResolvedValue(
      makeApiResponse({
        total_rows: '8', created: '6', existed: '2', failed: '0',
      }),
    );

    const result = await uploadCSV(makeFile());

    expect(result.totalRows).toBe(8);
    expect(result.createdSuccessfully).toBe(6);
    expect(result.alreadyExisted).toBe(2);
  });

  test('Should return ERROR_ROWS when there are failed rows', async () => {
    postBulkRegister.mockResolvedValue(
      makeApiResponse(
        {
          total_rows: '3', created: '0', existed: '0', failed: '2',
        },
        [makeApiRow({ row_number: '2' }), makeApiRow({ row_number: '4' })],
      ),
    );

    const result = await uploadCSV(makeFile());

    expect(result.type).toBe(BULK_REGISTRATION_STATES.ERROR_ROWS);
  });

  test('Should NOT return ERROR_ROWS when failed > 0 but rows array is empty', async () => {
    postBulkRegister.mockResolvedValue(
      makeApiResponse(
        {
          total_rows: '3', created: '3', existed: '0', failed: '1',
        },
        [],
      ),
    );

    const result = await uploadCSV(makeFile());

    // No rows array → falls through to SUCCESS_ALL
    expect(result.type).toBe(BULK_REGISTRATION_STATES.SUCCESS_ALL);
  });
});

describe('uploadCSV — parseFailedRows with object errors', () => {
  const rowsResponse = (rows) => makeApiResponse(
    {
      total_rows: String(rows.length),
      created: '0',
      existed: '0',
      failed: String(rows.length),
    },
    rows,
  );

  test('Should map row_number to row as (row_number - 1)', async () => {
    postBulkRegister.mockResolvedValue(rowsResponse([makeApiRow({ row_number: '3' })]));

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows[0].row).toBe(2);
  });

  test('Should include the email field from the API row', async () => {
    postBulkRegister.mockResolvedValue(rowsResponse([makeApiRow({ email: 'test@test.com' })]));

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows[0].email).toBe('test@test.com');
  });

  test('Should default email to "-" when it is missing', async () => {
    postBulkRegister.mockResolvedValue(rowsResponse([makeApiRow({ email: undefined })]));

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows[0].email).toBe('-');
  });

  test('Should include the status field from the API row', async () => {
    postBulkRegister.mockResolvedValue(rowsResponse([makeApiRow({ status: 'Processing failed' })]));

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows[0].status).toBe('Processing failed');
  });

  test('Should format message as "field: msg" for a single error field', async () => {
    postBulkRegister.mockResolvedValue(
      rowsResponse([makeApiRow({ errors: { email: ['Invalid format'] } })]),
    );

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows[0].message).toBe('email: Invalid format');
  });

  test('Should join multiple messages for the same field with ", "', async () => {
    postBulkRegister.mockResolvedValue(
      rowsResponse([makeApiRow({ errors: { email: ['Too short', 'Invalid format'] } })]),
    );

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows[0].message).toBe('email: Too short, Invalid format');
  });

  test('Should join multiple error fields with " | "', async () => {
    postBulkRegister.mockResolvedValue(
      rowsResponse([makeApiRow({ errors: { email: ['Required'], first_name: ['Too long'] } })]),
    );

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows[0].message).toBe('email: Required | first_name: Too long');
  });

  test('Should produce "-" as message when errors field is missing', async () => {
    postBulkRegister.mockResolvedValue(
      rowsResponse([makeApiRow({ errors: undefined })]),
    );

    const { failedRows } = await uploadCSV(makeFile());
    expect(failedRows[0].message).toBe('-');
  });

  test('Should map all rows in the response', async () => {
    postBulkRegister.mockResolvedValue(
      rowsResponse([makeApiRow({ row_number: '2' }), makeApiRow({ row_number: '5' })]),
    );

    const { failedRows } = await uploadCSV(makeFile());

    expect(failedRows).toHaveLength(2);
    expect(failedRows[0].row).toBe(1);
    expect(failedRows[1].row).toBe(4);
  });
});

describe('uploadCSV — parseFailedRows with array errors', () => {
  const rowsResponse = (rows) => makeApiResponse(
    {
      total_rows: String(rows.length),
      created: '0',
      existed: '0',
      failed: String(rows.length),
    },
    rows,
  );

  test('Should join array errors into a single comma-separated message', async () => {
    postBulkRegister.mockResolvedValue(
      rowsResponse([makeApiRow({ errors: ['Invalid email', 'Name required'] })]),
    );
    const { failedRows } = await uploadCSV(makeFile());
    expect(failedRows[0].message).toBe('Invalid email, Name required');
  });

  test('Should use a single array error message as-is', async () => {
    postBulkRegister.mockResolvedValue(
      rowsResponse([makeApiRow({ errors: ['Row is malformed'] })]),
    );
    const { failedRows } = await uploadCSV(makeFile());
    expect(failedRows[0].message).toBe('Row is malformed');
  });
});

describe('uploadCSV — validateCSVFile rejection', () => {
  test('Should throw when validateCSVFile rejects', async () => {
    validateCSVFile.mockRejectedValue(
      Object.assign(new Error('Invalid file type'), { response: undefined }),
    );

    await expect(uploadCSV(makeFile('bad.xlsx'))).rejects.toThrow();
  });

  test('Should not call postBulkRegister when validateCSVFile rejects', async () => {
    validateCSVFile.mockRejectedValue(
      Object.assign(new Error('Invalid file type'), { response: undefined }),
    );

    try { await uploadCSV(makeFile('bad.xlsx')); } catch { /* expected */ }

    expect(postBulkRegister).not.toHaveBeenCalled();
  });
});

describe('uploadCSV — handleUploadError: 400 with csv_file array', () => {
  const make400ArrayError = (messages) => Object.assign(new Error('Bad request'), {
    response: { status: 400, data: { csv_file: messages } },
  });

  test('Should throw an error when 400 response has csv_file as an array', async () => {
    postBulkRegister.mockRejectedValue(make400ArrayError(['File is empty.']));

    await expect(uploadCSV(makeFile())).rejects.toThrow('File is empty.');
  });

  test('Should set error.status to 400', async () => {
    postBulkRegister.mockRejectedValue(make400ArrayError(['File is empty.']));

    await expect(uploadCSV(makeFile())).rejects.toMatchObject({ status: 400 });
  });

  test('Should set error.detail by joining the csv_file array messages', async () => {
    postBulkRegister.mockRejectedValue(make400ArrayError(['Line 1 error.', 'Line 2 error.']));

    await expect(uploadCSV(makeFile())).rejects.toMatchObject({
      detail: 'Line 1 error. Line 2 error.',
    });
  });
});

describe('uploadCSV — handleUploadError: 400 with csv_file detail+rows', () => {
  const make400RowsError = (csvError) => Object.assign(new Error('Bad request'), {
    response: { status: 400, data: { csv_file: csvError } },
  });

  test('Should return ERROR_ROWS when 400 response has csv_file.detail and csv_file.rows', async () => {
    postBulkRegister.mockRejectedValue(
      make400RowsError({ detail: 'Some rows failed', rows: [makeApiRow()] }),
    );

    const result = await uploadCSV(makeFile());

    expect(result.type).toBe(BULK_REGISTRATION_STATES.ERROR_ROWS);
  });

  test('Should parse csv_file.rows into failedRows correctly', async () => {
    postBulkRegister.mockRejectedValue(
      make400RowsError({
        detail: 'Some rows failed',
        rows: [makeApiRow({ row_number: '3', email: 'x@x.com', status: 'Validation failed' })],
      }),
    );

    const result = await uploadCSV(makeFile());

    expect(result.failedRows[0]).toMatchObject({ row: 2, email: 'x@x.com', status: 'Validation failed' });
  });
});

describe('uploadCSV — handleUploadError: 500 / generic', () => {
  const make500Error = (detail) => Object.assign(new Error('Server error'), {
    response: { status: 500, data: { detail } },
  });

  test('Should throw when a 500 error is returned', async () => {
    postBulkRegister.mockRejectedValue(make500Error('Internal server error. Please contact support.'));

    await expect(uploadCSV(makeFile())).rejects.toThrow();
  });

  test('Should set error.status to the response status code', async () => {
    postBulkRegister.mockRejectedValue(make500Error('Internal server error. Please contact support.'));

    await expect(uploadCSV(makeFile())).rejects.toMatchObject({ status: 500 });
  });

  test('Should set error.detail from response.data.detail', async () => {
    postBulkRegister.mockRejectedValue(make500Error('Internal server error. Please contact support.'));

    await expect(uploadCSV(makeFile())).rejects.toMatchObject({
      detail: 'Internal server error. Please contact support.',
    });
  });

  test('Should fall back to error.message when response.data.detail is missing', async () => {
    const err = Object.assign(new Error('Network failure'), { response: { status: 503, data: {} } });
    postBulkRegister.mockRejectedValue(err);

    await expect(uploadCSV(makeFile())).rejects.toMatchObject({
      detail: 'Network failure',
    });
  });

  test('Should use status 500 when error has no response object', async () => {
    const err = Object.assign(new Error('No response'), { response: undefined });
    validateCSVFile.mockRejectedValue(err);

    await expect(uploadCSV(makeFile())).rejects.toMatchObject({ status: 500 });
  });
});
