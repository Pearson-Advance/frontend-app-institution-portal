import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getCoursesByInstitution(institutionId, limit, page, filters) {
  const params = {
    page,
    ...filters,
  };
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=${limit}&institution_id=${institutionId}`,
    { params },
  );
}

function getLicensesByInstitution(institutionId, limit, page = 1, urlParamsFilters = '') {
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool`
    + `/?limit=${limit}&institution_id=${institutionId}&page=${page}&${urlParamsFilters}`,
  );
}

function getClassesByInstitution(institutionId, courseName, limit = false, instructorsList = '', page = '') {
  const encodedCourseName = encodeURIComponent(courseName);
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/classes`
    + `/?limit=${limit}&institution_id=${institutionId}&course_name=${encodedCourseName}&instructors=${instructorsList}&page=${page}`,
  );
}

export {
  getCoursesByInstitution,
  getLicensesByInstitution,
  getClassesByInstitution,
};
