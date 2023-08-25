import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { snakeCaseObject, getConfig } from '@edx/frontend-platform';

function getStudentbyInstitutionAdmin(page, filters) {
  let params = {
    page: page,
    ...filters,
  };

  Object.keys(params).forEach((key) => {
    if (params[key] === '') {
      delete params[key];
    }
  });

  console.log(params)
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/students/`,
    { params },
  );
}

export {
    getStudentbyInstitutionAdmin,
};
