import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getCourseOperationsApiV2BaseUrl() {
  const {
    COURSE_OPERATIONS_API_V2_BASE_URL,
    LMS_BASE_URL,
  } = getConfig();

  if (COURSE_OPERATIONS_API_V2_BASE_URL) {
    return COURSE_OPERATIONS_API_V2_BASE_URL.replace(/\/$/, '');
  }

  return `${LMS_BASE_URL.replace(/\/$/, '')}/pearson_course_operation/api/v2`;
}

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

/**
 * Fetch class-detail analytics widgets.
 *
 * @param {Object} params - Request params.
 * @param {number|string} params.institutionId - Selected institution id.
 * @param {string} params.classId - Current class/course key.
 * @returns {Promise} Authenticated HTTP response.
 */
function getClassAnalyticsWidgets({ institutionId, classId }) {
  return getAuthenticatedHttpClient().get(
    `${getCourseOperationsApiV2BaseUrl()}/classes/analytics-widgets/`,
    {
      params: {
        institution_id: institutionId,
        class_id: classId,
      },
    },
  );
}

export {
  getClassAnalyticsWidgets,
  handleSkillableDashboard,
  handleXtremeLabsDashboard,
};
