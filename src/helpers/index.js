import { format } from 'date-fns';

/**
 * Format a UTC date
 *
 * @param {string} date - UTC date
 * @param {string} formatStr - pattern to be formatted
 * @returns {string} Formatted date
 */
export const formatUTCDate = (date, formatStr = 'MM/dd/yy') => {
  if (!date) {
    return null;
  }

  const [year, month, day] = date.slice(0, 10).split('-');
  return format(new Date(
    year,
    (month - 1),
    day,
  ), formatStr);
};

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
    return formatUTCDate(startDate, 'MMM d, yyyy');
  }

  const startYearFormatted = formatUTCDate(startDate, 'yyyy');
  const endYearFormatted = formatUTCDate(endDate, 'yyyy');

  if (startYearFormatted < endYearFormatted) {
    const formattedStartDate = formatUTCDate(startDate, 'MMM d, yyyy');
    const formattedEndDate = formatUTCDate(endDate, 'MMM d, yyyy');

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  const startMonthFormatted = formatUTCDate(startDate, 'MM');
  const endMonthFormatted = formatUTCDate(endDate, 'MM');

  if (startMonthFormatted < endMonthFormatted) {
    const formattedStartDate = formatUTCDate(startDate, 'MMM d');
    const formattedEndDate = formatUTCDate(endDate, 'MMM d, yyyy');

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  const formattedStartDate = formatUTCDate(startDate, 'MMM d');
  const formattedEndDate = formatUTCDate(endDate, 'd, yyyy');

  return `${formattedStartDate}-${formattedEndDate}`;
};

/**
 * Returns the initials of a given name. If the name is not provided or is empty, returns "?".
 *
 * @param {string} name - The name from which to extract initials.
 * @returns {string} The initials of the name or "?" if the name is not provided.
 *
 * @example
 * getInitials('Sam');
 * // Returns 'S'
 *
 * @example
 * getInitials('Sam Sepiol');
 * // Returns 'SS'
 *
 * @example
 * getInitials('');
 * // Returns '?'
 *
 * @example
 * getInitials('   ');
 * // Returns '?'
 *
 * @example
 * getInitials('John Doe Smith');
 * // Returns 'JDS'
 *
 * @example
 * getInitials('Mary-Jane Watson');
 * // Returns 'MW'
 */
export const getInitials = (name) => {
  if (!name || name.trim() === '') {
    return '?';
  }

  return name.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase()).join('');
};
