import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function handleSkillableDashboard(courseId) {
  const SKILLABLE_API_URL = `${getConfig().LMS_BASE_URL}/skillable_plugin/course-tab/api/v1`;

  return getAuthenticatedHttpClient().post(
    `${SKILLABLE_API_URL}/instructor-dashboard-launch/`,
    { class_id: courseId },
  );
}

function handleXtremeLabsDashboard(courseId) {
  const XTREME_LABS_API_URL = `${getConfig().LMS_BASE_URL}/xtreme_labs_plugin/course-tab/api/v1`;

  return getAuthenticatedHttpClient().post(
    `${XTREME_LABS_API_URL}/instructor-dashboard-launch/`,
    { class_id: courseId },
  );
}

export {
  handleSkillableDashboard,
  handleXtremeLabsDashboard,
};
