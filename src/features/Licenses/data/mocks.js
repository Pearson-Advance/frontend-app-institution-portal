import { LICENSE_POOL_TYPES } from 'features/constants';

/**
 * TEMPORARY mock data.
 *
 * The backend does not yet expose the `type` or `consumed` fields for license
 * pools. Everything in this module is injected client-side so the Offerings
 * views can be exercised ahead of the real endpoints. It is intentionally kept
 * isolated so it can be removed in one place once the API is available.
 */

const resolveMockType = (license) => {
  if (license.type) {
    return license.type;
  }

  // Deterministic by id so the listing and detail views stay in sync.
  return Number(license.licenseId) % 2 === 0
    ? LICENSE_POOL_TYPES.PROGRAM
    : LICENSE_POOL_TYPES.COURSES;
};

const resolveMockConsumed = (value) => {
  if (value.consumed !== undefined && value.consumed !== null) {
    return value.consumed;
  }

  return Number(value.numberOfStudents ?? 0) + Number(value.numberOfPendingStudents ?? 0);
};

/**
 * Adds mock `type` and `consumed` fields to license pool rows.
 * @param {Array} licenses - License pool rows from the API.
 * @returns {Array} Licenses enriched with mock Offerings data.
 */
export const withMockLicensePoolData = (licenses = []) => licenses.map((license) => ({
  ...license,
  type: resolveMockType(license),
  consumed: resolveMockConsumed(license),
}));

/**
 * Dummy license pools appended to the API response so the Offerings columns and
 * the program-type detail variation can be exercised end to end. High ids avoid
 * collisions with real pools. Remove once the backend returns this data.
 */
export const DUMMY_PROGRAM_LICENSE_ID = 900001;

// Links the dummy program license to a seeded Program (Cloud Practitioner).
export const DUMMY_PROGRAM_ID = 1;

export const DUMMY_LICENSE_POOLS = [
  {
    licenseId: DUMMY_PROGRAM_LICENSE_ID,
    licenseName: 'Program License (Mock)',
    type: LICENSE_POOL_TYPES.PROGRAM,
    programId: DUMMY_PROGRAM_ID,
    numberOfCourses: 12,
    purchasedSeats: 50,
    numberOfStudents: 20,
    numberOfPendingStudents: 5,
    consumed: 25,
  },
  {
    licenseId: 900002,
    licenseName: 'Courses License (Mock)',
    type: LICENSE_POOL_TYPES.COURSES,
    purchasedSeats: 30,
    numberOfStudents: 12,
    numberOfPendingStudents: 3,
    consumed: 15,
  },
];

/**
 * Dummy course rows shown in the detail table of the mock program license.
 * The backend returns no courses for the dummy pool, so these stand in.
 */
export const DUMMY_PROGRAM_LICENSE_COURSES = Array.from({ length: 12 }, (unused, index) => {
  const number = index + 1;
  const numberOfStudents = 20 - index;

  return {
    masterCourseId: `course-v1:Mock+PROG${number}+2026`,
    masterCourseName: `Mock Program Course ${number}`,
    numberOfStudents,
    consumed: Math.max(numberOfStudents - 2, 0),
  };
});

/**
 * Builds the license list for the Offerings-enabled experience: the real API
 * rows enriched with mock fields, plus the dummy pools used for testing.
 * @param {Array} licenses - License pool rows from the API.
 * @returns {Array} Enriched API rows followed by the dummy pools.
 */
export const withMockLicensePools = (licenses = []) => ([
  ...withMockLicensePoolData(licenses),
  ...DUMMY_LICENSE_POOLS,
]);

/**
 * Returns the detail-table rows for a program license. For the dummy program
 * pool (which has no backend courses) it falls back to the dummy course rows.
 * @param {Object} license - The license pool being viewed.
 * @param {Array} rows - Course rows coming from the API.
 * @returns {Array} Rows to render in the detail table.
 */
export const withMockProgramCourses = (license, rows = []) => {
  if (license?.licenseId === DUMMY_PROGRAM_LICENSE_ID && rows.length === 0) {
    return DUMMY_PROGRAM_LICENSE_COURSES;
  }

  return rows;
};

/**
 * Adds a mock `consumed` field to the rows of the license detail table.
 * @param {Array} rows - Course/program rows rendered in the detail table.
 * @returns {Array} Rows enriched with a mock consumed value.
 */
export const withMockConsumedData = (rows = []) => rows.map((row) => ({
  ...row,
  consumed: resolveMockConsumed(row),
}));
