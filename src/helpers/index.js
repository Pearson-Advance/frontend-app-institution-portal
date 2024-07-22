import { format } from 'date-fns';
import { logError } from '@edx/frontend-platform/logging';

import { assignStaffRole } from 'features/Main/data/api';

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

/**
 * Assigns a staff role to a class and then opens a new window or tab with a specific URL.
 *
 * @param {string} url - The URL to open in a new window or tab after assigning the role.
 * @param {string} classId - The ID of the class to which the staff role will be assigned.
 *
 * @returns {Promise} - The promise returned by the assignStaffRole function, which resolves once
 * the role assignment is complete.
 */
export const setAssignStaffRole = (url, classId) => assignStaffRole(classId).catch(logError).finally(() => {
  window.open(url, '_blank', 'noopener,noreferrer');
});

/**
 * Transforms an array of options to the format required for select components.
 *
 * @param {Array} options - The array of options to be formatted.
 * @param {string} options[].name - The name of the option.
 * @param {number|string} options[].id - The ID of the option.
 *
 * @returns {Array|null} The formatted options array or null if there's an error.
 */
export const formatSelectOptions = (options) => {
  if (!Array.isArray(options)) {
    logError('An array is required');

    return [];
  }

  if (options.length === 0) {
    logError('An array with options are required');

    return [];
  }

  if (Object.keys(options[0]).length === 0) {
    logError('An array with keys are required');

    return [];
  }

  return options.map(option => ({
    ...option,
    label: option.name,
    value: option.id,
  }));
};
