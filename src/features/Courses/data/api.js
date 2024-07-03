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

export {
  handleNewClass,
  handleEditClass,
  handleDeleteClass,
};
