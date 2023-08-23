import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { snakeCaseObject, getConfig } from '@edx/frontend-platform';

function getStudentbyInstitutionAdmin() {
  let params = {};

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/students/`,
    { params },
  );
}

export {
    getStudentbyInstitutionAdmin,
};
