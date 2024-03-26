/**
 * Enum for request status.
 * @readonly
 * @enum {string}
 */
export const RequestStatus = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Obj for initial service state.
 * @object
 */
export const initialStateService = {
  data: [],
  status: RequestStatus.LOADING,
  error: null,
};

/**
 * Number for initial page.
 * @readonly
 * @number
 */
export const initialPage = 1;

/**
 * Constants for time.
 * @readonly
 * @number
 */
export const hoursDay = 24;
export const daysWeek = 7;

/**
 * URLs.
 * @readonly
 * @string
 */
export const licenseBuyLink = 'https://www.mindhubpro.com/';

/**
 * Constants status.
 * @readonly
 * @enum {string}
 */
export const ClassStatus = {
  in_progress: 'In progress',
  complete: 'Complete',
  pending: 'Pending',
};

/**
 * Badge Variants.
 * @readonly
 * @enum {string}
 */
export const badgeVariants = {
  in_progress: 'primary',
  complete: 'success',
  pending: 'warning',
};
