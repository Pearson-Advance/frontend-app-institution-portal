import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getStudentbyInstitutionAdmin(page) {
  const params = { page };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/students/`,
    { params },
  );
}

export { getStudentbyInstitutionAdmin };
