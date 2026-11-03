import {
  withMockLicensePoolData,
  withMockConsumedData,
  withMockLicensePools,
  withMockProgramCourses,
  DUMMY_LICENSE_POOLS,
  DUMMY_PROGRAM_LICENSE_ID,
  DUMMY_PROGRAM_LICENSE_COURSES,
} from 'features/Licenses/data/mocks';
import { LICENSE_POOL_TYPES } from 'features/constants';

describe('license pool mock data', () => {
  describe('withMockLicensePoolData', () => {
    test('returns an empty array when called without arguments', () => {
      expect(withMockLicensePoolData()).toEqual([]);
    });

    test('assigns a deterministic type and consumed value by license id', () => {
      const [program, courses] = withMockLicensePoolData([
        { licenseId: 2, numberOfStudents: 4, numberOfPendingStudents: 1 },
        { licenseId: 3, numberOfStudents: 2, numberOfPendingStudents: 2 },
      ]);

      expect(program.type).toBe(LICENSE_POOL_TYPES.PROGRAM);
      expect(program.consumed).toBe(5);

      expect(courses.type).toBe(LICENSE_POOL_TYPES.COURSES);
      expect(courses.consumed).toBe(4);
    });

    test('keeps type and consumed values already provided', () => {
      const [license] = withMockLicensePoolData([
        {
          licenseId: 2,
          type: LICENSE_POOL_TYPES.COURSES,
          consumed: 99,
          numberOfStudents: 4,
          numberOfPendingStudents: 1,
        },
      ]);

      expect(license.type).toBe(LICENSE_POOL_TYPES.COURSES);
      expect(license.consumed).toBe(99);
    });
  });

  describe('withMockLicensePools', () => {
    test('enriches the API rows and appends the dummy pools', () => {
      const result = withMockLicensePools([
        { licenseId: 3, numberOfStudents: 2, numberOfPendingStudents: 2 },
      ]);

      expect(result).toHaveLength(1 + DUMMY_LICENSE_POOLS.length);
      expect(result[0]).toMatchObject({ type: LICENSE_POOL_TYPES.COURSES, consumed: 4 });
      expect(result.slice(-DUMMY_LICENSE_POOLS.length)).toEqual(DUMMY_LICENSE_POOLS);
    });

    test('returns only the dummy pools when there are no API rows', () => {
      expect(withMockLicensePools()).toEqual(DUMMY_LICENSE_POOLS);
    });
  });

  describe('withMockConsumedData', () => {
    test('adds a consumed value derived from enrolled and pending students', () => {
      const [row] = withMockConsumedData([
        { masterCourseName: 'Course 1', numberOfStudents: 3, numberOfPendingStudents: 2 },
      ]);

      expect(row.consumed).toBe(5);
    });

    test('returns an empty array when called without arguments', () => {
      expect(withMockConsumedData()).toEqual([]);
    });
  });

  describe('withMockProgramCourses', () => {
    test('returns the dummy courses for the dummy program license without API rows', () => {
      expect(withMockProgramCourses({ licenseId: DUMMY_PROGRAM_LICENSE_ID }, []))
        .toEqual(DUMMY_PROGRAM_LICENSE_COURSES);
    });

    test('keeps the API rows when they exist', () => {
      const rows = [{ masterCourseName: 'Real Course' }];
      expect(withMockProgramCourses({ licenseId: DUMMY_PROGRAM_LICENSE_ID }, rows)).toBe(rows);
    });

    test('keeps the API rows for a non-dummy license', () => {
      const rows = [{ masterCourseName: 'Real Course' }];
      expect(withMockProgramCourses({ licenseId: 5 }, rows)).toBe(rows);
    });
  });
});
