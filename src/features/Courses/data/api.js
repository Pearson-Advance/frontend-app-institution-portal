import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function handleNewClass(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/create-class/`,
    data,
  );
}

function handleEditClass(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().patch(
    `${apiV2BaseUrl}/classes/`,
    data,
  );
}

export {
  handleNewClass,
  handleEditClass,
};
