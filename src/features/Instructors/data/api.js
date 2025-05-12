import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function handleInstructorsEnrollment(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/assign-instructor/`,
    data,
  );
}

function handleNewInstructor(institutionId, instructorFormData) {
  const apiV2BaseUrl = `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/?institution_id=${institutionId}`;
  const searchParams = new URLSearchParams(instructorFormData);

  return getAuthenticatedHttpClient().post(`${apiV2BaseUrl}&${searchParams}`);
}

/**
 * Get events list by instructor.
 *
 * @param {object} - An object with the start and end date range for the calendar
 *                   Dates in format ISO
 * @returns {Promise} - A promise that resolves with the response of the GET request.
 */
function getEventsByInstructor(params) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/events/`,
    { params },
  );
}

/**
 * Retrieves instructor information based on their email address.
 *
 * @param email - Takes an `email` parameter which is used to
 *                search for an instructor by their email address.
 * @param [options] - Is an object that can contain additional configuration settings.
 *
 * @returns {Promise} the result of a GET request made to the specified URL
 */
function getInstructorByEmail(email, options = {}) {
  const defaultParams = {
    limit: false,
  };

  const params = {
    instructor_email: email,
    ...defaultParams,
    ...options,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/`,
    { params },
  );
}

/**
 * Sends a PATCH request to update an instructor's information.
 * @param {Object} instructorData - The payload containing updated instructor details.
 * @param {number} instructorInfo.institution_id - The ID of the institution to which the instructor belongs.
 * @param {number} instructorInfo.instructor_id - The ID of the instructor to be edited.
 * @param {boolean} [instructorInfo.enrollment_privilege] - Whether the instructor has enrollment privileges.
 *
 * @returns {Promise} A promise resolving to the response of the PATCH request.
 */

function handleEditInstructor(instructorData) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().patch(
    `${apiV2BaseUrl}/instructors/`,
    instructorData,
  );
}

export {
  handleInstructorsEnrollment,
  handleNewInstructor,
  getEventsByInstructor,
  getInstructorByEmail,
  handleEditInstructor,
};
