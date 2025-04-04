import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { MAX_TABLE_RECORDS } from 'features/constants';

function getCoursesByInstitution(institutionId, limit, page, filters) {
  const params = {
    page,
    page_size: MAX_TABLE_RECORDS,
    ...filters,
  };
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=${limit}&institution_id=${institutionId}`,
    { params },
  );
}

function getLicensesByInstitution(institutionId, limit, page = 1, urlParamsFilters = '') {
  const params = {
    page,
    page_size: MAX_TABLE_RECORDS,
    ...urlParamsFilters,
  };
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool`
    + `/?limit=${limit}&institution_id=${institutionId}`,
    { params },
  );
}

function getClassesByInstitution(institutionId, courseId, limit = false, page = '', urlParamsFilters = '') {
  const encodedCourseId = encodeURIComponent(courseId);
  const params = {
    limit,
    institution_id: institutionId,
    page,
    page_size: MAX_TABLE_RECORDS,
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
    page_size: MAX_TABLE_RECORDS,
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
