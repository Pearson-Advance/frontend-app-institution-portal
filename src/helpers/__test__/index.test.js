import { logError } from '@edx/frontend-platform/logging';

import {
  formatDateRange,
  formatUTCDate,
  getInitials,
  setAssignStaffRole,
} from 'helpers';

import { assignStaffRole } from 'features/Main/data/api';

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
