import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

// MOCK TO TEST - REMOVE THIS WHEN THE API IS READY
const USE_MOCK = true;
export const MOCK_PROGRAM_DETAIL = {
  program_id: 1,
  program_title: 'Master in Artificial Intelligence & Data Science',
  number_of_students: 54,
  total_sessions: 3,
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
export {
  getProgramDetail,
};
