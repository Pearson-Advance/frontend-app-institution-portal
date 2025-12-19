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
 * Help message shown to unauthorized users.
 * @constant {string}
 */
export const UNAUTHORIZED_HELP_MESSAGE = 'Administrative access to the Pearson Skilling Suite is granted once a license order for Skilling Suite courses is fulfilled. If you believe you should have admin access to the Pearson Skilling Suite, please contact our support team at';

/**
 * Support email.
 * @constant {string}
 */
export const SUPPORT_EMAIL = 'pearsonskillingsupport@pearson.com';

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

/**
 * Number for maximum records in tables.
 * @readonly
 * @number
 */
export const MAX_TABLE_RECORDS = 200;

/**
 * Modal confirmation text, when an instructor is about to be deactivated.
 * @constant {string}
 */
export const deactivationMessage = 'You’ve selected to deactivate this instructor. This action will unassign the instructor from any currently '
+ 'active or scheduled classes, and will remove their access to all class materials and student data. Would you like to proceed?';

/**
 * Instructors status to be used in filters.
 * @constant {Object}
 */
export const INSTRUCTOR_STATUS_TABS = {
  ALL: 'All',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

/**
 * Action types for voucher state transitions.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_ACTIONS = {
  ASSIGN_START: 'ASSIGN_START',
  ASSIGN_END: 'ASSIGN_END',
  REVOKE_START: 'REVOKE_START',
  REVOKE_END: 'REVOKE_END',
  SET_MESSAGE: 'SET_MESSAGE',
};

/**
 * HTTP status codes used for API responses.
 * @readonly
 * @enum {number}
 */
export const HTTP_STATUS = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
};

/**
 * Success messages displayed after voucher actions.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_SUCCESS_MESSAGES = {
  ASSIGN: 'Voucher assigned successfully.',
  REVOKE: 'Voucher revoked successfully.',
};

/**
 * Error messages displayed after voucher actions fail.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_ERROR_MESSAGES = {
  ASSIGN: 'An unexpected error occurred while assigning the voucher.',
  REVOKE: 'An unexpected error occurred while revoking the voucher.',
  NOT_FOUND: 'No voucher or assignee found for this request.',
  UNPROCESSABLE: 'No exam series code found for this request.',
};

/**
 * UI labels used in voucher-related elements.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_UI_LABELS = {
  ASSIGN: 'Assign a voucher',
  ASSIGNING: 'Assigning...',
  REVOKE: 'Revoke voucher',
  REVOKING: 'Revoking...',
};

/**
 * Voucher status values used in the voucher management system.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_STATUS = {
  AVAILABLE: 'Available',
  REVOKED: 'Revoked',
};

/**
 * Rule types for determining voucher assignment behavior.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_RULE_TYPES = {
  NO_VOUCHER: 'NO_VOUCHER',
  OTHER_AVAILABLE: 'OTHER_AVAILABLE',
  OTHER_REVOKED: 'OTHER_REVOKED',
  SAME_AVAILABLE: 'SAME_AVAILABLE',
  SAME_REVOKED: 'SAME_REVOKED',
  DEFAULT: 'DEFAULT',
};

/**
 * Computed status values displayed in the UI.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_COMPUTED_STATUS = {
  NOT_APPLICABLE: 'N/A',
  AVAILABLE: 'assigned',
  REVOKED: 'revoked',
};

/**
 * UI badge style variants.
 * @readonly
 * @enum {string}
 */
export const VOUCHER_BADGE_VARIANTS = {
  [VOUCHER_COMPUTED_STATUS.AVAILABLE]: 'success',
  [VOUCHER_COMPUTED_STATUS.REVOKED]: 'danger',
};

/**
 * Configuration mapping rule types to UI behavior.
 * @readonly
 */
export const VOUCHER_RULES = {
  [VOUCHER_RULE_TYPES.NO_VOUCHER]: {
    computedStatus: VOUCHER_COMPUTED_STATUS.NOT_APPLICABLE,
    showAssign: true,
    showRevoke: false,
  },
  [VOUCHER_RULE_TYPES.OTHER_AVAILABLE]: {
    computedStatus: VOUCHER_COMPUTED_STATUS.NOT_APPLICABLE,
    showAssign: false,
    showRevoke: false,
  },
  [VOUCHER_RULE_TYPES.OTHER_REVOKED]: {
    computedStatus: VOUCHER_COMPUTED_STATUS.NOT_APPLICABLE,
    showAssign: true,
    showRevoke: false,
  },
  [VOUCHER_RULE_TYPES.SAME_AVAILABLE]: {
    computedStatus: VOUCHER_COMPUTED_STATUS.AVAILABLE,
    showAssign: false,
    showRevoke: true,
  },
  [VOUCHER_RULE_TYPES.SAME_REVOKED]: {
    computedStatus: VOUCHER_COMPUTED_STATUS.REVOKED,
    showAssign: true,
    showRevoke: false,
  },
  [VOUCHER_RULE_TYPES.DEFAULT]: {
    computedStatus: VOUCHER_COMPUTED_STATUS.NOT_APPLICABLE,
    showAssign: false,
    showRevoke: false,
  },
};
