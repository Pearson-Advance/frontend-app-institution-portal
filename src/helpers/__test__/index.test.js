import { formatDateRange } from 'helpers';

describe('formatDateRange', () => {
  test('Should return "-" when startDate is not provided', () => {
    expect(formatDateRange(null)).toBe('-');
    expect(formatDateRange(undefined)).toBe('-');
    expect(formatDateRange(false)).toBe('-');
    expect(formatDateRange('')).toBe('-');
  });

  test('Should return formatted start date when only startDate is provided', () => {
    const startDate = new Date(2023, 10, 6);
    expect(formatDateRange(startDate)).toBe('Nov 6, 2023');
  });

  test('Should return formatted date range when both startDate and endDate are provided', () => {
    const startDate = new Date(2023, 10, 6);
    const endDate = new Date(2023, 10, 10);
    expect(formatDateRange(startDate, endDate)).toBe('Nov 6-10, 2023');
  });

  test('Should return formatted date range when startDate and endDate have a lot year(s) of difference', () => {
    const startDate = new Date(2023, 10, 6);
    const endDate = new Date(2024, 10, 10);
    expect(formatDateRange(startDate, endDate)).toBe('Nov 6, 2023 - Nov 10, 2024');
  });

  test('Should return formatted date range when startDate and endDate have a lot month(s) of difference', () => {
    const startDate = new Date(2023, 10, 6);
    const endDate = new Date(2023, 12, 10);
    expect(formatDateRange(startDate, endDate)).toBe('Nov 6, 2023 - Jan 10, 2024');
  });
});
