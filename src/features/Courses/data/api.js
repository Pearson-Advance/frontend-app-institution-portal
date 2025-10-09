import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function handleNewClass(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/classes/`,
    data,
  );
}

function handleEditClass(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().patch(
    `${apiV2BaseUrl}/classes/`,
    data,
  );
}

/**
 * Deletes a class with the specified classId.
 *
 * This function constructs the API URL for deleting a class and
 * sends a DELETE request using an authenticated HTTP client.
 *
 * @param {string} classId - The ID of the class to be deleted.
 * @returns {Promise} - A promise that resolves with the response of the DELETE request.
 */
function handleDeleteClass(classId) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const data = JSON.stringify({ class_id: classId });

  return getAuthenticatedHttpClient().delete(
    `${apiV2BaseUrl}/classes/`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    },
  );
}

/**
 * Assigns a voucher to a learner for a specific course.
 *
 * Makes a POST request to the voucher assignment endpoint with the provided data.
 * This function requires authentication and will include the user's credentials
 * in the request automatically through the authenticated HTTP client.
 *
 * @param {Object} data - The voucher assignment data
 * @param {string} data.institution_uuid - The UUID of the institution
 * @param {string} data.course_id - The ID of the course to assign the voucher for
 * @param {string} data.email - The email address of the learner receiving the voucher
 *
 * @returns {Promise<AxiosResponse>} A promise that resolves to the HTTP response object
 */
function assignVoucher(data) {
  return getAuthenticatedHttpClient().post(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/vouchers/assign/`,
    data,
  );
}

export {
  assignVoucher,
  handleNewClass,
  handleEditClass,
  handleDeleteClass,
};
