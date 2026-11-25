export const ENROLLMENT_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  REJECTED: 'rejected',
};

/**
 * Single classification rule for enrollment results, shared by the submit
 * handler (toast / retry) and the feedback block.
 * Only `completed` counts as a success; any other status (failed, rejected,
 * or anything unknown such as pending/skipped) is treated as not enrolled,
 * so it is shown as an error and kept in the textarea for a retry.
 */
export const SUCCESSFUL_ENROLLMENT_STATUSES = [ENROLLMENT_STATUS.COMPLETED];

export const isEnrollmentSuccessful = (status) => (
  SUCCESSFUL_ENROLLMENT_STATUSES.includes(status)
);

export const DEFAULT_ENROLLMENT_ERROR = 'An error occurred while attempting to enroll the student.';

/**
 * Splits free text by newlines and commas, trims each entry and drops empties.
 * @param {string} text
 * @returns {string[]}
 */
export const parseIdentifiers = (text = '') => text
  .split(/[\n,]+/)
  .map((item) => item.trim())
  .filter(Boolean);

/**
 * Merges enrollment results across attempts by identifier.
 * Order of first appearance is preserved; the most recent result wins on conflict.
 * @param {Array<{identifier: string}>} previous
 * @param {Array<{identifier: string}>} latest
 */
export const mergeEnrollmentResults = (previous = [], latest = []) => {
  const merged = new Map(previous.map((item) => [item.identifier, item]));
  latest.forEach((item) => merged.set(item.identifier, item));
  return Array.from(merged.values());
};

/**
 * Groups results into successfully enrolled identifiers and error groups
 * (identifiers sharing the same error message).
 */
export const groupEnrollmentResults = (results = []) => {
  const completed = [];
  const errorsMap = new Map();

  results.forEach((item) => {
    if (isEnrollmentSuccessful(item.status)) {
      completed.push(item.identifier);
      return;
    }

    const errorReason = item.error || `Enrollment ${item.status}.`;
    const currentList = errorsMap.get(errorReason) || [];
    currentList.push(item.identifier);
    errorsMap.set(errorReason, currentList);
  });

  const errorGroups = Array.from(errorsMap.entries()).map(([error, identifiers]) => ({
    error,
    identifiers,
  }));

  return { completed, errorGroups };
};

/**
 * Builds a human readable message from an RTK Query mutation error.
 */
export const extractApiErrorMessage = (error) => {
  const errorData = error?.data;

  if (typeof errorData === 'string' && errorData) { return errorData; }
  if (errorData && typeof errorData === 'object') {
    if (errorData.detail) { return errorData.detail; }
    if (errorData.message) { return errorData.message; }
    if (Array.isArray(errorData.non_field_errors)) {
      return errorData.non_field_errors.join(' ');
    }

    const fieldErrors = Object.entries(errorData)
      .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join('\n');

    if (fieldErrors) { return fieldErrors; }
  }

  return error?.message || DEFAULT_ENROLLMENT_ERROR;
};
