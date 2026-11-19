import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getPrograms(institutionId, page = 1, limit = 10, params = {}) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offerings/`,
    {
      params: {
        institution_id: institutionId,
        page,
        limit,
        ...params,
      },
    },
  );
}

function getProgramDetail(programId, institutionId) {
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
  getPrograms,
  getProgramDetail,
};
