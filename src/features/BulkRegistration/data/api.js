import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

export async function postBulkRegister(file) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const formData = new FormData();
  formData.append('csv_file', file);

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/bulk-user-register/`,
    formData,
  );
}
