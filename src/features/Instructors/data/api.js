import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getInstructorData(page, filters) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const params = {
    page,
    ...filters,
  };

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/instructors/`,
    { params },
  );
}

function getCCXList() {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/classes/?limit=false`,
  );
}

function handleInstructorsEnrollment(data, courseId) {
  const INSTRUCTOR_API_URL = `${getConfig().LMS_BASE_URL}/courses/course_id/instructor/api`;
  const courseIdSearchPattern = /course_id/;

  return getAuthenticatedHttpClient().post(
    `${INSTRUCTOR_API_URL.replace(courseIdSearchPattern, courseId)}/modify_access`,
    data,
  );
}

export {
  getInstructorData,
  getCCXList,
  handleInstructorsEnrollment,
};
