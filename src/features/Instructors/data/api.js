import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getInstructorData(institutionId, page, filters) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const params = {
    page,
    institution_id: institutionId,
    ...filters,
  };

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/instructors/`,
    { params },
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

function handleNewInstructor(institutionId, instructorEmail) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/instructors/?instructor_email=${instructorEmail}&institution_id=${institutionId}`,
  );
}

export {
  getInstructorData,
  handleInstructorsEnrollment,
  handleNewInstructor,
};
