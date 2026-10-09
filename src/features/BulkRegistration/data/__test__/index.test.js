import { validateCSVFile } from 'helpers';
import {
  processBulkRegistration, getRequiredColumns, getBulkRegisterApi,
} from 'features/BulkRegistration/data';
import { postBulkRegisterStudents, postBulkRegisterInstructors } from 'features/BulkRegistration/data/api';
import { BULK_REGISTRATION_STATES, BULK_REGISTRATION_REQUIRED_COLUMNS_INSTRUCTORS, BULK_REGISTRATION_REQUIRED_COLUMNS_STUDENTS } from 'features/constants';

jest.mock('helpers', () => ({
  validateCSVFile: jest.fn(),
}));

jest.mock('features/BulkRegistration/data/api', () => ({
  postBulkRegisterStudents: jest.fn(),
  postBulkRegisterInstructors: jest.fn(),
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

const makeInstructorApiResponse = (summary = {}, rows = []) => ({
  data: {
    summary: {
      total_rows: '0', created: '0', existed: '0', failed: '0', ...summary,
    },
    rows,
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
  postBulkRegisterStudents.mockResolvedValue(makeApiResponse());
  postBulkRegisterInstructors.mockResolvedValue(makeInstructorApiResponse());
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Helper Utilities', () => {
  test('getRequiredColumns returns instructor columns when isInstructor is true', () => {
    expect(getRequiredColumns(true)).toEqual(BULK_REGISTRATION_REQUIRED_COLUMNS_INSTRUCTORS);
  });

  test('getRequiredColumns returns student columns when isInstructor is false', () => {
    expect(getRequiredColumns(false)).toEqual(BULK_REGISTRATION_REQUIRED_COLUMNS_STUDENTS);
  });

  test('getBulkRegisterApi returns postBulkRegisterInstructors when isInstructor is true', () => {
    expect(getBulkRegisterApi(true)).toBe(postBulkRegisterInstructors);
  });

  test('getBulkRegisterApi returns postBulkRegisterStudents when isInstructor is false', () => {
    expect(getBulkRegisterApi(false)).toBe(postBulkRegisterStudents);
  });
});

describe('processBulkRegistration — Students (Happy path)', () => {
  test('Should call validateCSVFile with student required columns', async () => {
    const file = makeFile();
    await processBulkRegistration(file, false);
    expect(validateCSVFile).toHaveBeenCalledWith(file, BULK_REGISTRATION_REQUIRED_COLUMNS_STUDENTS);
  });

  test('Should call postBulkRegisterStudents with the provided file and institutionId', async () => {
    const file = makeFile();
    await processBulkRegistration(file, false, 'inst-123');
    expect(postBulkRegisterStudents).toHaveBeenCalledWith(file, 'inst-123');
  });

  test('Should return SUCCESS_ALL when there are no failures or existing users', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      makeApiResponse({
        total_rows: '5', created: '5', existed: '0', failed: '0',
      }),
    );

    const result = await processBulkRegistration(makeFile(), false);

    expect(result.type).toBe(BULK_REGISTRATION_STATES.SUCCESS_ALL);
  });

  test('Should return totalRegistered from created when SUCCESS_ALL', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      makeApiResponse({
        total_rows: '5', created: '5', existed: '0', failed: '0',
      }),
    );

    const result = await processBulkRegistration(makeFile(), false);

    expect(result.totalRegistered).toBe(5);
  });

  test('Should fall back to total_rows for totalRegistered when created is 0', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      makeApiResponse({
        total_rows: '3', created: '0', existed: '0', failed: '0',
      }),
    );

    const result = await processBulkRegistration(makeFile(), false);

    expect(result.totalRegistered).toBe(3);
  });

  test('Should return SUCCESS_PARTIAL when some users already existed', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      makeApiResponse({
        total_rows: '8', created: '6', existed: '2', failed: '0',
      }),
    );

    const result = await processBulkRegistration(makeFile(), false);

    expect(result.type).toBe(BULK_REGISTRATION_STATES.SUCCESS_PARTIAL);
  });

  test('Should return correct numeric stats for SUCCESS_PARTIAL', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      makeApiResponse({
        total_rows: '8', created: '6', existed: '2', failed: '0',
      }),
    );

    const result = await processBulkRegistration(makeFile(), false);

    expect(result.totalRows).toBe(8);
    expect(result.createdSuccessfully).toBe(6);
    expect(result.alreadyExisted).toBe(2);
  });

  test('Should return ERROR_ROWS when there are failed rows', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      makeApiResponse(
        {
          total_rows: '3', created: '0', existed: '0', failed: '2',
        },
        [makeApiRow({ row_number: '2' }), makeApiRow({ row_number: '4' })],
      ),
    );

    const result = await processBulkRegistration(makeFile(), false);

    expect(result.type).toBe(BULK_REGISTRATION_STATES.ERROR_ROWS);
  });
});

describe('processBulkRegistration — Instructors (Happy path)', () => {
  test('Should call validateCSVFile with instructor required columns', async () => {
    const file = makeFile('instructors.csv');
    await processBulkRegistration(file, true);
    expect(validateCSVFile).toHaveBeenCalledWith(file, BULK_REGISTRATION_REQUIRED_COLUMNS_INSTRUCTORS);
  });

  test('Should call postBulkRegisterInstructors with the provided file and institutionId', async () => {
    const file = makeFile('instructors.csv');
    await processBulkRegistration(file, true, 'inst-999');
    expect(postBulkRegisterInstructors).toHaveBeenCalledWith(file, 'inst-999');
  });

  test('Should parse instructor response structure (summary in root) and return SUCCESS_ALL', async () => {
    postBulkRegisterInstructors.mockResolvedValue(
      makeInstructorApiResponse({
        total_rows: '4', created: '4', existed: '0', failed: '0',
      }),
    );

    const result = await processBulkRegistration(makeFile('instructors.csv'), true);

    expect(result.type).toBe(BULK_REGISTRATION_STATES.SUCCESS_ALL);
    expect(result.totalRegistered).toBe(4);
  });

  test('Should parse instructor response structure with failed rows', async () => {
    postBulkRegisterInstructors.mockResolvedValue(
      makeInstructorApiResponse(
        {
          total_rows: '2', created: '1', existed: '0', failed: '1',
        },
        [makeApiRow({ row_number: '2', email: 'inst@example.com' })],
      ),
    );

    const result = await processBulkRegistration(makeFile('instructors.csv'), true);

    expect(result.type).toBe(BULK_REGISTRATION_STATES.ERROR_ROWS);
    expect(result.failedRowsCount).toBe(1);
    expect(result.failedRows[0].email).toBe('inst@example.com');
  });
});

describe('processBulkRegistration — parseFailedRows formatters', () => {
  const rowsResponse = (rows) => makeApiResponse(
    {
      total_rows: String(rows.length),
      created: '0',
      existed: '0',
      failed: String(rows.length),
    },
    rows,
  );

  test('Should map row_number to row field', async () => {
    postBulkRegisterStudents.mockResolvedValue(rowsResponse([makeApiRow({ row_number: '3' })]));

    const { failedRows } = await processBulkRegistration(makeFile(), false);

    expect(failedRows[0].row).toBe('3');
  });

  test('Should include email and status fields from the API row', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      rowsResponse([makeApiRow({ email: 'test@test.com', status: 'Processing failed' })]),
    );

    const { failedRows } = await processBulkRegistration(makeFile(), false);

    expect(failedRows[0].email).toBe('test@test.com');
    expect(failedRows[0].status).toBe('Processing failed');
  });

  test('Should format error object messages correctly', async () => {
    postBulkRegisterStudents.mockResolvedValue(
      rowsResponse([makeApiRow({ errors: { email: ['Invalid format'] } })]),
    );

    const { failedRows } = await processBulkRegistration(makeFile(), false);

    expect(failedRows[0].message).toBe('email: Invalid format');
  });
});

describe('processBulkRegistration — Error Handling', () => {
  test('Should handle validateCSVFile rejection and throw custom error object', async () => {
    validateCSVFile.mockRejectedValue(
      Object.assign(new Error('Invalid file type'), { status: 400, detail: 'Invalid file type' }),
    );

    await expect(processBulkRegistration(makeFile('bad.xlsx'), false)).rejects.toThrow('Invalid file type');
    expect(postBulkRegisterStudents).not.toHaveBeenCalled();
  });

  test('Should set status and detail when validateCSVFile rejects', async () => {
    validateCSVFile.mockRejectedValue(
      Object.assign(new Error('Invalid file type'), { status: 400, detail: 'Invalid file type' }),
    );

    await expect(processBulkRegistration(makeFile('bad.xlsx'), false)).rejects.toMatchObject({
      status: 400,
      detail: 'Invalid file type',
    });
  });

  test('Should handle API 500 error and throw custom error object with detail', async () => {
    const err = Object.assign(new Error('Server error'), {
      response: { status: 500, data: { detail: 'Internal server error' } },
    });
    postBulkRegisterStudents.mockRejectedValue(err);

    await expect(processBulkRegistration(makeFile(), false)).rejects.toMatchObject({
      status: 500,
      detail: 'Internal server error',
    });
  });
});
