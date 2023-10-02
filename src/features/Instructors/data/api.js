import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getInstructorData(page) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const params = {
    page,
  };

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/instructors/`,
    { params },
  );
}

export {
  getInstructorData,
};
