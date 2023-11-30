import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getCoursesByInstitution(institutionId) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?institution_id=${institutionId}`,
  );
}

export {
  getCoursesByInstitution,
};