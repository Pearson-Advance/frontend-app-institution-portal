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

function getClassesByInstitution(institutionId, courseId, limit = false, page = '', urlParamsFilters = '') {
  const encodedCourseId = encodeURIComponent(courseId);
  const params = {
    limit,
    institution_id: institutionId,
    page,
    ...urlParamsFilters,
  };
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/classes/?course_id=${encodedCourseId}`,
    { params },
  );
}

function getInstructorByInstitution(institutionId, page, filters, limit = false) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const params = {
    page,
    institution_id: institutionId,
    ...filters,
    limit,
  };

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/instructors/`,
    { params },
  );
}

export {
  getCoursesByInstitution,
  getLicensesByInstitution,
  getClassesByInstitution,
  getInstructorByInstitution,
};
