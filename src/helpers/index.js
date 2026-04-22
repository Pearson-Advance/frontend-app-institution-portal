import { format } from 'date-fns';
import { logError } from '@edx/frontend-platform/logging';

import { assignStaffRole } from 'features/Main/data/api';
import { BULK_REGISTRATION_MAX_ROWS, BULK_REGISTRATION_REQUIRED_COLUMNS } from 'features/constants';

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

/**
 * Validates a CSV file before processing.
 *
 * The function performs several checks:
 * - Ensures the file is a CSV based on MIME type or file extension.
 * - Verifies the file is not empty.
 * - Confirms that all required columns are present in the header row.
 * - Ensures the file contains at least one data row.
 * - Enforces a maximum number of allowed rows.
 *
 * If any validation fails, an Error is thrown with additional metadata
 * (`status` and `detail`) that can be used for API responses.
 *
 * @async
 * @function validateCSVFile
 * @param {File} file - The uploaded file object to validate.
 *
 * @throws {Error} Throws an error if:
 * - The file is not a CSV.
 * - The file is empty.
 * - Required columns are missing.
 * - The file has no data rows.
 * - The file exceeds the maximum allowed number of rows.
 *
 * @returns {Promise<boolean>} Resolves to `true` if the file passes all validations.
 */
export async function validateCSVFile(file) {
  const isCSV = file.type === 'text/csv'
    || file.name.toLowerCase().endsWith('.csv');

  if (!isCSV) {
    throw Object.assign(new Error('Invalid file type. Only CSV files are allowed.'), {
      status: 400,
      detail: 'Invalid file type. Only CSV files are allowed.',
    });
  }

  const text = await file.text();
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw Object.assign(new Error('The CSV file is empty.'), {
      status: 400,
      detail: 'The CSV file is empty.',
    });
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const missingColumns = BULK_REGISTRATION_REQUIRED_COLUMNS.filter((col) => !headers.includes(col));

  if (missingColumns.length > 0) {
    throw Object.assign(
      new Error(`Missing required columns: ${missingColumns.join(', ')}`),
      {
        status: 400,
        detail: `Missing required columns: ${missingColumns.join(', ')}`,
      },
    );
  }

  const dataRows = lines.length - 1;

  if (dataRows <= 0) {
    throw Object.assign(new Error('The CSV file must contain at least 1 data row.'), {
      status: 400,
      detail: 'The CSV file must contain at least 1 data row.',
    });
  }

  if (dataRows > BULK_REGISTRATION_MAX_ROWS) {
    throw Object.assign(
      new Error(`The CSV file exceeds the maximum allowed rows. Max: ${BULK_REGISTRATION_MAX_ROWS}, Found: ${dataRows}`),
      {
        status: 400,
        detail: `The CSV file exceeds the maximum allowed rows. Max: ${BULK_REGISTRATION_MAX_ROWS}, Found: ${dataRows}`,
      },
    );
  }

  return true;
}

/**
 * Generates a default date range where the start date is 4 weeks prior to today.
 *
 * This is typically used for filtering data (e.g., API queries) by sending
 * a dynamic `startDate` that represents a rolling 4-week window.
 *
 * @function getDefaultDates
 * @returns {{ startDate: string }}
 * An object containing:
 * - startDate: A string in YYYY-MM-DD format representing the date 4 weeks ago from today.
 *
 * @example
 * // If today is 2026-04-27
 * getDefaultDates();
 * // returns: { startDate: "2026-03-30" }
 */
export const getDefaultDates = (startDate) => {
  const start = startDate ? new Date(startDate) : new Date();

  const fourWeeksAgo = new Date(
    start.getTime() - (28 * 24 * 60 * 60 * 1000),
  );

  const toISO = (date) => date.toISOString().split('T')[0];

  return {
    startDate: toISO(fourWeeksAgo),
    labelStartDate: toISO(start),
  };
};

/**
 * Filters out empty, null, or undefined values from a parameters object.
 *
 * @param {Object} params - The object containing key-value pairs to filter.
 * @returns {Object} A new object containing only entries with non-empty, non-null, and non-undefined values.
 *
 * @example
 * buildFilterParams({ name: 'John', age: null, city: '', country: 'US' });
 * // Returns: { name: 'John', country: 'US' }
 */
export const buildFilterParams = (params) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
);
