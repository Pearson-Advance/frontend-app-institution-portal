/**
 * Enum for request status.
 * @readonly
 * @enum {string}
 */
export const RequestStatus = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  INITIAL: 'initial',
  COMPLETE_WITH_ERRORS: 'complete-with-errors',
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

/**
 * Query parameter name for the institution ID.
 * @constant {string}
 */
export const INSTITUTION_QUERY_ID = 'institutionId';

/**
 * Text to inform users about the use of cookies on the website.
 * @constant {string}
 */
export const cookieText = 'This website uses cookies to ensure you get the best experience on our website. If you continue browsing this site, we understand that you accept the use of cookies.';

/**
 * Text for unauthorized user.
 * @constant {string}
 */
export const unauthorizedText = 'You do not have access to CertPREP Manager. If you believe you should have access then please contact your sales rep.';
