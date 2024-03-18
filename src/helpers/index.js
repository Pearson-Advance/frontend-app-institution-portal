import { format } from 'date-fns';

/**
 * Formats a date range string based on the start and end dates.
 *
 * @param {Date} startDate The start date of the range.
 * @param {Date} endDate The end date of the range.
 * @returns {string} The formatted date range string.
 *                   If only the start date is provided, it returns the formatted start date.
 *                   If both start and end dates are provided, it returns the formatted date range.
 *                   If no start date is provided, it returns '-'.
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate) {
    return '-';
  }

  if (!endDate) {
    return format(startDate, 'MMM d, yyyy');
  }

  const startYearFormatted = format(startDate, 'yyyy');
  const endYearFormatted = format(endDate, 'yyyy');

  if (startYearFormatted < endYearFormatted) {
    const formattedStartDate = format(startDate, 'MMM d, yyyy');
    const formattedEndDate = format(endDate, 'MMM d, yyyy');

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  const startMonthFormatted = format(startDate, 'MM');
  const endMonthFormatted = format(endDate, 'MM');

  if (startMonthFormatted < endMonthFormatted) {
    const formattedStartDate = format(startDate, 'MMM d');
    const formattedEndDate = format(endDate, 'MMM d, yyyy');

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  const formattedStartDate = format(startDate, 'MMM d');
  const formattedEndDate = format(endDate, 'd, yyyy');

  return `${formattedStartDate}-${formattedEndDate}`;
};
