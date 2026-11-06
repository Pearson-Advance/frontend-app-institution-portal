import { getConfig } from '@edx/frontend-platform';

/**
 * Dummy class-detail data for the session (Programs/Offerings) feature.
 *
 * These mocks let the class-in-session detail view render populated class info
 * and a students table while the real backend endpoints are not available yet.
 * Everything here is injected ONLY when the `PSS_ENABLE_OFFERINGS` flag is on and
 * the requested course/class matches one of the seeded session classes, so the
 * course-based class detail view is never affected.
 *
 * The identifiers mirror `MOCK_SESSION_DETAIL` in features/Sessions/data/api.js.
 */

export const isOfferingsFlagEnabled = () => Boolean(getConfig().PSS_ENABLE_OFFERINGS);

// Shaped like a `getClassesByCourse` result (already camelCased).
export const MOCK_SESSION_CLASS_DETAILS = [
  {
    classId: 'class-101-a',
    className: 'Introduction to Computer Science - Section A',
    masterCourseId: 'course-v1:EdX+CS101+2026',
    masterCourseName: 'CS101: Computer Science Basics',
    numberOfStudents: 22,
    numberOfPendingStudents: 3,
    maxStudents: 30,
    minStudentsAllowed: 10,
    purchasedSeats: 30,
    totalEnrollments: 22,
    totalPendingEnrollments: 3,
    hidden: false,
    startDate: '2026-03-01T00:00:00Z',
    endDate: '2026-06-30T00:00:00Z',
    examSeriesCode: '',
    instructors: ['Dr. Jane Doe', 'Prof. Alan Turing'],
  },
  {
    classId: 'class-102-b',
    className: 'Data Structures - Section B',
    masterCourseId: 'course-v1:EdX+CS102+2026',
    masterCourseName: 'CS102: Data Structures & Algorithms',
    numberOfStudents: 18,
    numberOfPendingStudents: 1,
    maxStudents: 25,
    minStudentsAllowed: 5,
    purchasedSeats: 25,
    totalEnrollments: 18,
    totalPendingEnrollments: 1,
    hidden: false,
    startDate: '2026-03-15T00:00:00Z',
    endDate: '2026-06-15T00:00:00Z',
    examSeriesCode: '',
    instructors: ['Grace Hopper'],
  },
  {
    classId: 'class-103-c',
    className: 'Web Development Lab',
    masterCourseId: 'course-v1:EdX+CS103+2026',
    masterCourseName: 'CS103: Modern Web Applications',
    numberOfStudents: 14,
    numberOfPendingStudents: 0,
    maxStudents: 20,
    minStudentsAllowed: 8,
    purchasedSeats: 20,
    totalEnrollments: 14,
    totalPendingEnrollments: 0,
    hidden: false,
    startDate: '2026-04-01T00:00:00Z',
    endDate: '2026-06-30T00:00:00Z',
    examSeriesCode: '',
    instructors: [],
  },
];

const buildStudent = (overrides) => ({
  courseId: '',
  classId: '',
  status: 'Active',
  lastLogin: '2026-04-10T10:00:00Z',
  lastAccess: '2026-04-12T15:30:00Z',
  completePercentage: 0,
  examReady: {
    status: 'NOT_STARTED',
    lastExamDate: null,
    eppDaysLeft: null,
  },
  ...overrides,
});

// Shaped like a `getStudentsByClass` result (already camelCased), keyed by classId.
export const MOCK_SESSION_CLASS_STUDENTS = {
  'class-101-a': [
    buildStudent({
      userId: 90101,
      learnerName: 'Ada Lovelace',
      learnerEmail: 'ada.lovelace@example.com',
      classId: 'class-101-a',
      courseId: 'course-v1:EdX+CS101+2026',
      completePercentage: 82,
      examReady: { status: 'PASSED', lastExamDate: '2026-05-20T00:00:00Z', eppDaysLeft: 12 },
    }),
    buildStudent({
      userId: 90102,
      learnerName: 'Charles Babbage',
      learnerEmail: 'charles.babbage@example.com',
      classId: 'class-101-a',
      courseId: 'course-v1:EdX+CS101+2026',
      completePercentage: 47,
    }),
    buildStudent({
      userId: 90103,
      learnerName: 'Katherine Johnson',
      learnerEmail: 'katherine.johnson@example.com',
      classId: 'class-101-a',
      courseId: 'course-v1:EdX+CS101+2026',
      status: 'pending',
      completePercentage: 0,
    }),
  ],
  'class-102-b': [
    buildStudent({
      userId: 90201,
      learnerName: 'Alan Kay',
      learnerEmail: 'alan.kay@example.com',
      classId: 'class-102-b',
      courseId: 'course-v1:EdX+CS102+2026',
      completePercentage: 65,
    }),
    buildStudent({
      userId: 90202,
      learnerName: 'Barbara Liskov',
      learnerEmail: 'barbara.liskov@example.com',
      classId: 'class-102-b',
      courseId: 'course-v1:EdX+CS102+2026',
      completePercentage: 91,
    }),
  ],
  'class-103-c': [
    buildStudent({
      userId: 90301,
      learnerName: 'Tim Berners-Lee',
      learnerEmail: 'tim.bernerslee@example.com',
      classId: 'class-103-c',
      courseId: 'course-v1:EdX+CS103+2026',
      completePercentage: 73,
    }),
  ],
};

export const isSessionMockCourse = (courseId = '') => MOCK_SESSION_CLASS_DETAILS.some(
  (classDetail) => classDetail.masterCourseId === courseId,
);

export const getMockSessionClasses = (courseId = '') => MOCK_SESSION_CLASS_DETAILS.filter(
  (classDetail) => classDetail.masterCourseId === courseId,
);

export const isSessionMockClass = (classId = '') => Object.prototype.hasOwnProperty.call(
  MOCK_SESSION_CLASS_STUDENTS,
  classId,
);

export const getMockSessionStudents = (classId = '') => {
  const results = MOCK_SESSION_CLASS_STUDENTS[classId] || [];

  return {
    results,
    count: results.length,
    numPages: 1,
  };
};
