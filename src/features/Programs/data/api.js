import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

// MOCK TO TEST - REMOVE THIS WHEN THE API IS READY
const USE_MOCK = true;
export const MOCK_PROGRAM_DETAIL = {
  program_id: 1,
  program_title: 'Master in Artificial Intelligence & Data Science',
  number_of_students: 54,
  total_sessions: 3,
  purchased_seats: 100,
  consumed_seats: 45,
  enrolled_students: 54,
  remaining_seats: 55,
};
export const MOCK_PROGRAM_COURSES = {
  count: 3,
  num_pages: 1,
  results: [
    {
      course_id: 'course-v1:Edx+CS101+2026',
      course_name: 'Introduction to Machine Learning',
      number_of_sessions: 2,
      instructors: ['Dr. John Doe', 'Prof. Jane Smith'],
      number_of_students: 28,
    },
    {
      course_id: 'course-v1:Edx+DS201+2026',
      course_name: 'Deep Learning & Neural Networks',
      number_of_sessions: 1,
      instructors: ['Dr. Alan Turing'],
      number_of_students: 26,
    },
    {
      course_id: 'course-v1:Edx+AI301+2026',
      course_name: 'Ethics in AI & Data Governance',
      number_of_sessions: 0,
      instructors: [],
      number_of_students: 0,
    },
  ],
};

function getProgramDetail(programId, institutionId) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: MOCK_PROGRAM_DETAIL,
        });
      }, 200);
    });
  }

  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offerings/${encodeURIComponent(programId)}/`,
    {
      params: {
        institution_id: institutionId,
      },
    },
  );
}

function getCoursesByProgram(programId, institutionId, page = 1) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: MOCK_PROGRAM_COURSES,
        });
      }, 200);
    });
  }

  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offerings/${encodeURIComponent(programId)}/courses/`,
    {
      params: {
        institution_id: institutionId,
        page,
      },
    },
  );
}

export {
  getProgramDetail,
  getCoursesByProgram,
};
