import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

const USE_MOCK = true;

// MOCK TO TEST - REMOVE THIS WHEN THE API IS READY
export const MOCK_SESSION_DETAIL = {
  count: 3,
  num_pages: 1,
  results: [
    {
      session_id: 'session-2026-spring',
      session_name: 'Spring 2026 Cohort',
      program_title: 'Computer Science Professional Certificate',
      number_of_students: 42,
      total_classes: 3,
      start_date: '2026-03-01T00:00:00Z',
      end_date: '2026-06-30T00:00:00Z',
      classes: [
        {
          class_id: 'class-101-a',
          class_name: 'Introduction to Computer Science - Section A',
          course_name: 'CS101: Computer Science Basics',
          master_course_id: 'course-v1:EdX+CS101+2026',
          number_of_students: 22,
          min_students: 10,
          max_students: 30,
          start_date: '2026-03-01T00:00:00Z',
          end_date: '2026-06-30T00:00:00Z',
          instructors_with_status: [
            { name: 'Dr. Jane Doe', status: 'assigned' },
            { name: 'Prof. Alan Turing', status: 'assigned' },
          ],
        },
        {
          class_id: 'class-102-b',
          class_name: 'Data Structures - Section B',
          course_name: 'CS102: Data Structures & Algorithms',
          master_course_id: 'course-v1:EdX+CS102+2026',
          number_of_students: 18,
          min_students: 5,
          max_students: 25,
          start_date: '2026-03-15T00:00:00Z',
          end_date: '2026-06-15T00:00:00Z',
          instructors_with_status: [
            { name: 'Grace Hopper', status: 'assigned' },
          ],
        },
        {
          class_id: 'class-103-c',
          class_name: 'Web Development Lab',
          course_name: 'CS103: Modern Web Applications',
          master_course_id: 'course-v1:EdX+CS103+2026',
          number_of_students: 14,
          min_students: 8,
          max_students: 20,
          start_date: '2026-04-01T00:00:00Z',
          end_date: '2026-06-30T00:00:00Z',
          instructors_with_status: [],
        },
      ],
    },
    {
      session_id: 'session-2026-summer',
      session_name: 'Summer 2026 Cohort',
      number_of_students: 18,
      start_date: '2026-07-01T00:00:00Z',
      end_date: '2026-10-31T00:00:00Z',
      instructors_with_status: [
        { name: 'Grace Hopper', status: 'assigned' },
      ],
    },
    {
      session_id: 'session-2026-fall',
      session_name: 'Fall 2026 Cohort',
      number_of_students: 14,
      start_date: '2026-11-01T00:00:00Z',
      end_date: '2027-02-28T00:00:00Z',
      instructors_with_status: [],
    },
  ],
};

function getSessionsByOffering(institutionId, offeringId, page = 1, limit = 10, params = {}) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: MOCK_SESSION_DETAIL,
        });
      }, 500);
    });
  }

  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offerings-runs/`,
    {
      params: {
        institution_id: institutionId,
        offering_id: offeringId,
        page,
        limit,
        ...params,
      },
    },
  );
}

function getSessionDetail(institutionId, sessionId, params = {}) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const session = MOCK_SESSION_DETAIL.results.find(
          (item) => item.session_id === sessionId,
        ) || MOCK_SESSION_DETAIL.results[0];

        resolve({
          data: session,
        });
      }, 500);
    });
  }

  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offerings-runs/${sessionId}/`,
    {
      params: {
        institution_id: institutionId,
        ...params,
      },
    },
  );
}

/**
 * Creates a new session (offering run).
 */
function handleNewSession(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/sessions/`,
    data,
  );
}

/**
 * Updates an existing session.
 */
function handleEditSession(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().patch(
    `${apiV2BaseUrl}/sessions/`,
    data,
  );
}

/**
 * Deletes a session by sessionId.
 */
function handleDeleteSession(sessionId) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const data = JSON.stringify({ session_id: sessionId });

  return getAuthenticatedHttpClient().delete(
    `${apiV2BaseUrl}/sessions/`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    },
  );
}

/**
 * Enrolls a student into a session (cascades across constituent classes).
 */
function enrollStudentToSession(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/sessions/enroll/`,
    data,
  );
}

export {
  getSessionsByOffering,
  handleNewSession,
  handleEditSession,
  handleDeleteSession,
  enrollStudentToSession,
  getSessionDetail,
};
