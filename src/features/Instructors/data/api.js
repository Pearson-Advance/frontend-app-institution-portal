import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function handleInstructorsEnrollment(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/assign-instructor/`,
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
  handleInstructorsEnrollment,
  handleNewInstructor,
};
