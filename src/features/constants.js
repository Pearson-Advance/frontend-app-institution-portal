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

/**
 * Constant for text length.
 * @readonly
 * @number
 */
export const textLength = 20;

/**
 * Texts for class delete modal.
 * @constant {string}
 */
export const modalDeleteText = {
  title: 'Delete this class',
  body: 'This action will permanently delete this class and cannot be undone. Booked seat in this class will not be affected by this action.',
};

/**
 * Custom styles for first option underlline in selector.
 *@object
 */
export const styleFirstOption = {
  menuList: (base) => ({
    ...base,
    boxShadow: '0 5px 5px -3px #0003, 0 8px 10px 1px #00000024, 0 3px 14px 2px #0000001f',
    border: 0,
    padding: 0,
    borderRadius: '0px 0px 4px 4px;',
    '& :first-child': {
      textDecoration: 'underline',
      color: '#007394',
    },
  }),
};

/**
 * All result option.
 * @constant {Object}
 */
export const allResultsOption = {
  label: 'Show all search results',
  value: 'all_results',
};
