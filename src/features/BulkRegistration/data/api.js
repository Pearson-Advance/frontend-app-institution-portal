import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

export async function postBulkRegisterStudents(file) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const formData = new FormData();
  formData.append('csv_file', file);

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/bulk-user-register/`,
    formData,
  );
}

export async function postBulkRegisterInstructors(file, institutionId) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const formData = new FormData();
  formData.append('csv_file', file);
  if (institutionId) {
    formData.append('institution_id', institutionId);
  }

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/instructors/bulk-register/`,
    formData,
  );
}
