import { formatDateRange, formatUTCDate } from 'helpers';

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
