import { logError } from '@edx/frontend-platform/logging';

import {
  formatDateRange,
  formatUTCDate,
  getInitials,
  setAssignStaffRole,
  validateCSVFile,
  buildFilterParams,
} from 'helpers';

import { assignStaffRole } from 'features/Main/data/api';
import { BULK_REGISTRATION_REQUIRED_COLUMNS, BULK_REGISTRATION_MAX_ROWS } from 'features/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Main/data/api', () => ({
  assignStaffRole: jest.fn(),
}));

describe('formatDateRange', () => {
  test('Should return "-" when startDate is not provided', () => {
    expect(formatDateRange(null)).toBe('-');
    expect(formatDateRange(undefined)).toBe('-');
    expect(formatDateRange(false)).toBe('-');
    expect(formatDateRange('')).toBe('-');
  });

  test('Should return formatted start date when only startDate is provided', () => {
    const startDate = '2023-11-6';
    expect(formatDateRange(startDate)).toBe('Nov 6, 2023');
  });

  test('Should return formatted date range when both startDate and endDate are provided', () => {
    const startDate = '2023-11-6';
    const endDate = '2023-11-10';
    expect(formatDateRange(startDate, endDate)).toBe('Nov 6-10, 2023');
  });

  test('Should return formatted date range when startDate and endDate have a lot year(s) of difference', () => {
    const startDate = '2023-11-6';
    const endDate = '2024-11-10';
    expect(formatDateRange(startDate, endDate)).toBe('Nov 6, 2023 - Nov 10, 2024');
  });

  test('Should return formatted date range when startDate and endDate have a lot month(s) of difference', () => {
    const startDate = '2023-11-6';
    const endDate = '2024-1-10';
    expect(formatDateRange(startDate, endDate)).toBe('Nov 6, 2023 - Jan 10, 2024');
  });
});

describe('formatUTCDate', () => {
  test('should return formatted date', () => {
    const dateUTC = '2024-04-02T00:00:00Z';
    expect(formatUTCDate(dateUTC)).toBe('04/02/24');
  });
});

describe('getInitials', () => {
  test('Should return correct initials for a given name', () => {
    expect(getInitials('Sam Sepiol')).toBe('SS');
  });

  test('Should return "?" for an empty name', () => {
    expect(getInitials('')).toBe('?');
  });

  test('Should return "?" for a name with only spaces', () => {
    expect(getInitials('   ')).toBe('?');
  });

  test('Should return correct initials for a name with multiple spaces between words', () => {
    expect(getInitials('John   Doe   Smith')).toBe('JDS');
  });

  test('Should return correct initials for a hyphenated name', () => {
    expect(getInitials('Mary-Jane Watson')).toBe('MW');
  });
});

describe('setAssignStaffRole', () => {
  const originalWindowOpen = window.open;

  beforeAll(() => {
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = originalWindowOpen;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should open a new window with the correct URL on success', async () => {
    assignStaffRole.mockResolvedValueOnce();

    const url = 'http://example.com';
    const classId = '12345';

    await setAssignStaffRole(url, classId);

    expect(assignStaffRole).toHaveBeenCalledWith(classId);
    expect(logError).not.toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
  });

  test('Should log an error and open a new window with the correct URL on failure', async () => {
    const error = new Error('Assignment failed');
    assignStaffRole.mockRejectedValueOnce(error);

    const url = 'http://example.com';
    const classId = '12345';

    await setAssignStaffRole(url, classId);

    expect(assignStaffRole).toHaveBeenCalledWith(classId);
    expect(logError).toHaveBeenCalledWith(error);
    expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
  });
});

describe('validateCSVFile', () => {
  beforeAll(() => {
    if (typeof File.prototype.text !== 'function') {
      File.prototype.text = function text() {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsText(this);
        });
      };
    }
  });

  afterAll(() => {
    delete File.prototype.text;
  });

  const buildCSV = (rowCount = 1, headers = BULK_REGISTRATION_REQUIRED_COLUMNS) => {
    const header = headers.join(',');
    const rows = Array.from({ length: rowCount }, (_, i) => `John${i},Doe${i},John Doe ${i},john${i}@example.com,pass${i}`);
    return [header, ...rows].join('\n');
  };

  const makeCSVFile = (content, name = 'students.csv', type = 'text/csv') => new File([content], name, { type });
  const validFile = (rowCount = 1) => makeCSVFile(buildCSV(rowCount));

  describe('file type', () => {
    test('Should resolve true for a file with text/csv MIME type', async () => {
      await expect(validateCSVFile(validFile())).resolves.toBe(true);
    });

    test('Should resolve true for a file with .csv extension regardless of MIME type', async () => {
      const file = makeCSVFile(buildCSV(), 'data.csv', 'application/octet-stream');
      await expect(validateCSVFile(file)).resolves.toBe(true);
    });

    test('Should resolve true for a file with uppercase .CSV extension', async () => {
      const file = makeCSVFile(buildCSV(), 'DATA.CSV', 'application/octet-stream');
      await expect(validateCSVFile(file)).resolves.toBe(true);
    });

    test('Should throw for a non-CSV MIME type without .csv extension', async () => {
      const file = makeCSVFile('some content', 'students.xlsx', 'application/vnd.ms-excel');
      await expect(validateCSVFile(file)).rejects.toThrow('Invalid file type. Only CSV files are allowed.');
    });

    test('Should set status 400 on the invalid file type error', async () => {
      const file = makeCSVFile('content', 'data.pdf', 'application/pdf');
      await expect(validateCSVFile(file)).rejects.toMatchObject({ status: 400 });
    });

    test('Should set detail on the invalid file type error', async () => {
      const file = makeCSVFile('content', 'data.pdf', 'application/pdf');
      await expect(validateCSVFile(file)).rejects.toMatchObject({
        detail: 'Invalid file type. Only CSV files are allowed.',
      });
    });
  });

  describe('empty file', () => {
    test('Should throw for a completely empty file', async () => {
      const file = makeCSVFile('');
      await expect(validateCSVFile(file)).rejects.toThrow('The CSV file is empty.');
    });

    test('Should throw for a file containing only whitespace', async () => {
      const file = makeCSVFile('   \n   \n   ');
      await expect(validateCSVFile(file)).rejects.toThrow('The CSV file is empty.');
    });

    test('Should set status 400 on the empty file error', async () => {
      await expect(validateCSVFile(makeCSVFile(''))).rejects.toMatchObject({ status: 400 });
    });

    test('Should set detail on the empty file error', async () => {
      await expect(validateCSVFile(makeCSVFile(''))).rejects.toMatchObject({
        detail: 'The CSV file is empty.',
      });
    });
  });

  describe('missing required columns', () => {
    test('Should throw when all required columns are missing', async () => {
      const file = makeCSVFile('foo,bar\nval1,val2');
      await expect(validateCSVFile(file)).rejects.toThrow('Missing required columns:');
    });

    test('Should include the missing column names in the error message', async () => {
      const headers = [...BULK_REGISTRATION_REQUIRED_COLUMNS];
      headers.splice(0, 2);
      const content = [headers.join(','), 'John Doe,john@example.com,pass'].join('\n');
      const file = makeCSVFile(content);
      await expect(validateCSVFile(file)).rejects.toThrow('Missing required columns: First Name, Last Name');
    });

    test('Should throw when only one required column is missing', async () => {
      const headers = BULK_REGISTRATION_REQUIRED_COLUMNS.filter((c) => c !== 'email');
      const content = [headers.join(','), 'John,Doe,John Doe,pass'].join('\n');
      await expect(validateCSVFile(makeCSVFile(content))).toBeTruthy();
    });

    test('Should set status 400 on the missing columns error', async () => {
      const file = makeCSVFile('foo,bar\nval1,val2');
      await expect(validateCSVFile(file)).rejects.toMatchObject({ status: 400 });
    });

    test('Should set detail matching the error message on missing columns', async () => {
      const file = makeCSVFile('foo,bar\nval1,val2');
      await expect(validateCSVFile(file)).rejects.toMatchObject({
        detail: expect.stringContaining('Missing required columns:'),
      });
    });

    test('Should strip surrounding quotes from header values before checking', async () => {
      const quotedHeader = BULK_REGISTRATION_REQUIRED_COLUMNS.map((c) => `"${c}"`).join(',');
      const content = [quotedHeader, 'John,Doe,John Doe,john@example.com,pass'].join('\n');
      await expect(validateCSVFile(makeCSVFile(content))).resolves.toBe(true);
    });

    test('Should trim whitespace from header values before checking', async () => {
      const spacedHeader = BULK_REGISTRATION_REQUIRED_COLUMNS.map((c) => `  ${c}  `).join(',');
      const content = [spacedHeader, 'John,Doe,John Doe,john@example.com,pass'].join('\n');
      await expect(validateCSVFile(makeCSVFile(content))).resolves.toBe(true);
    });

    test('Should not throw when extra columns beyond required are present', async () => {
      const headers = [...BULK_REGISTRATION_REQUIRED_COLUMNS, 'phone', 'country'];
      const content = [headers.join(','), 'John,Doe,John Doe,john@example.com,pass,555,US'].join('\n');
      await expect(validateCSVFile(makeCSVFile(content))).resolves.toBe(true);
    });
  });

  describe('no data rows', () => {
    test('Should throw when the file contains only the header row', async () => {
      const file = makeCSVFile(BULK_REGISTRATION_REQUIRED_COLUMNS.join(','));
      await expect(validateCSVFile(file)).rejects.toThrow('The CSV file must contain at least 1 data row.');
    });

    test('Should throw when the only non-empty content is the header', async () => {
      const content = `${BULK_REGISTRATION_REQUIRED_COLUMNS.join(',')}\n   \n   `;
      await expect(validateCSVFile(makeCSVFile(content))).rejects.toThrow(
        'The CSV file must contain at least 1 data row.',
      );
    });

    test('Should set status 400 on the no data rows error', async () => {
      const file = makeCSVFile(BULK_REGISTRATION_REQUIRED_COLUMNS.join(','));
      await expect(validateCSVFile(file)).rejects.toMatchObject({ status: 400 });
    });

    test('Should set detail on the no data rows error', async () => {
      const file = makeCSVFile(BULK_REGISTRATION_REQUIRED_COLUMNS.join(','));
      await expect(validateCSVFile(file)).rejects.toMatchObject({
        detail: 'The CSV file must contain at least 1 data row.',
      });
    });
  });

  describe('max rows exceeded', () => {
    test(`Should throw when the file has more than ${BULK_REGISTRATION_MAX_ROWS} data rows`, async () => {
      const file = validFile(BULK_REGISTRATION_MAX_ROWS + 1);
      await expect(validateCSVFile(file)).rejects.toThrow('exceeds the maximum allowed rows');
    });

    test('Should include the max and actual count in the error message', async () => {
      const overLimit = BULK_REGISTRATION_MAX_ROWS + 5;
      const file = validFile(overLimit);
      await expect(validateCSVFile(file)).rejects.toThrow(`Max: ${BULK_REGISTRATION_MAX_ROWS}, Found: ${overLimit}`);
    });

    test('Should set status 400 on the max rows exceeded error', async () => {
      await expect(validateCSVFile(validFile(BULK_REGISTRATION_MAX_ROWS + 1))).rejects.toMatchObject({ status: 400 });
    });

    test('Should set detail matching the error message on max rows exceeded', async () => {
      await expect(validateCSVFile(validFile(BULK_REGISTRATION_MAX_ROWS + 1))).rejects.toMatchObject({
        detail: expect.stringContaining('exceeds the maximum allowed rows'),
      });
    });

    test(`Should resolve true for a file with exactly ${BULK_REGISTRATION_MAX_ROWS} data rows`, async () => {
      await expect(validateCSVFile(validFile(BULK_REGISTRATION_MAX_ROWS))).resolves.toBe(true);
    });

    test('Should resolve true for a file with 1 data row', async () => {
      await expect(validateCSVFile(validFile(1))).resolves.toBe(true);
    });
  });

  describe('validation priority order', () => {
    test('Should throw file type error before checking for empty content', async () => {
      const file = makeCSVFile('', 'data.pdf', 'application/pdf');
      await expect(validateCSVFile(file)).rejects.toThrow('Invalid file type');
    });

    test('Should throw empty file error before checking required columns', async () => {
      const file = makeCSVFile('\n\n');
      await expect(validateCSVFile(file)).rejects.toThrow('The CSV file is empty.');
    });

    test('Should throw missing columns error before checking data rows', async () => {
      const file = makeCSVFile('foo,bar');
      await expect(validateCSVFile(file)).rejects.toThrow('Missing required columns:');
    });
  });
});

describe('buildFilterParams', () => {
  test('should remove null values', () => {
    const result = buildFilterParams({ name: 'John', age: null });
    expect(result).toEqual({ name: 'John' });
  });

  test('should remove undefined values', () => {
    const result = buildFilterParams({ name: 'John', age: undefined });
    expect(result).toEqual({ name: 'John' });
  });

  test('should remove empty string values', () => {
    const result = buildFilterParams({ name: 'John', city: '' });
    expect(result).toEqual({ name: 'John' });
  });

  test('should remove all empty, null, and undefined values at once', () => {
    const result = buildFilterParams({
      name: 'John', age: null, city: '', country: undefined,
    });
    expect(result).toEqual({ name: 'John' });
  });

  test('should return the same object if all values are valid', () => {
    const result = buildFilterParams({ name: 'John', age: 30, city: 'NY' });
    expect(result).toEqual({ name: 'John', age: 30, city: 'NY' });
  });

  test('should return an empty object if all values are invalid', () => {
    const result = buildFilterParams({ name: '', age: null, city: undefined });
    expect(result).toEqual({});
  });

  test('should return an empty object if input is empty', () => {
    const result = buildFilterParams({});
    expect(result).toEqual({});
  });

  test('should keep falsy values that are not empty string, null, or undefined', () => {
    const result = buildFilterParams({ active: false, count: 0 });
    expect(result).toEqual({ active: false, count: 0 });
  });
});
