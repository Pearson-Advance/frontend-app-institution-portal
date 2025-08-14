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

/**
 * Checks whether a specific feature flag is enabled for the current user.
 *
 * This function fetches the list of enabled feature flags from the backend
 * on its first call and caches them in a `Set` to avoid repeated requests.
 * Subsequent calls check the cached list for the given `flagName`.
 *
 * @async
 * @param {Object} params - Function parameters.
 * @param {string} params.flagName - The name of the feature flag to check.
 * @returns {Promise<boolean|null>} - Returns `true` if the flag is enabled,
 *   `false` if disabled, or `null` if the check could not be performed.
 */
async function isFeatureEnabled({ flagName }) {
  try {
    if (!isFeatureEnabled.enabledFlagsSet) {
      const url = `${getConfig().LMS_BASE_URL}/pearson-core/feature-flags/enabled-flags/`;
      const { data } = await getAuthenticatedHttpClient().get(url, { withCredentials: true });

      if (!Array.isArray(data?.enabled_flags)) {
        return null;
      }

      isFeatureEnabled.enabledFlagsSet = new Set(data.enabled_flags);
    }

    return isFeatureEnabled.enabledFlagsSet.has(flagName);
  } catch {
    return null;
  }
}

export {
  getCoursesByInstitution,
  getLicensesByInstitution,
  getClassesByInstitution,
  getInstructorByInstitution,
  isFeatureEnabled,
};
