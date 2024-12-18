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
 * Delete event.
 *
 * @param {number} - Event id to be deleted
 * @returns {Promise} - A promise that resolves with the response of the DELETE request.
 */
function deleteEvent(eventId, options = {}) {
  const params = {
    event_id: eventId,
    ...options,
  };
  return getAuthenticatedHttpClient().delete(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/events/`,
    { params },
  );
}

export {
  handleInstructorsEnrollment,
  handleNewInstructor,
  getEventsByInstructor,
  deleteEvent,
};
