import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { getInstructorByInstitution } from 'features/Common/data/api';
import {
  handleInstructorsEnrollment,
  handleNewInstructor,
  getEventsByInstructor,
  getInstructorByEmail,
  handleEditInstructor,
} from 'features/Instructors/data/api';
import {
  updateEvents,
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  assignInstructorsRequest,
  assignInstructorsSuccess,
  updateInstructorInfoStatus,
  updateInstructorInfo,
  assignInstructorsFailed,
  updateEventsRequestStatus,
  updateInstructorFormRequest,
  fetchInstructorOptionsRequest,
  fetchInstructorOptionsSuccess,
  fetchInstructorOptionsFailed,
} from 'features/Instructors/data/slice';
import { RequestStatus, initialPage } from 'features/constants';

function fetchInstructorsData(id, currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchInstructorsDataRequest());
    try {
      const response = camelCaseObject(await getInstructorByInstitution(id, currentPage, filtersData, true));
      dispatch(fetchInstructorsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchInstructorsDataFailed());
      logError(error);
    }
  };
}

function fetchInstructorsOptionsData(id, currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchInstructorOptionsRequest());
    try {
      const response = camelCaseObject(await getInstructorByInstitution(id, currentPage, filtersData));
      dispatch(fetchInstructorOptionsSuccess(response.data));
    } catch (error) {
      dispatch(fetchInstructorOptionsFailed());
      logError(error);
    }
  };
}

/**
 * Assign instructors to a class.
 * @param {Object} data - The data containing information about the instructors to be assigned.
 * @returns {Promise<void>} - A promise that resolves after dispatching appropriate actions.
 */
function assignInstructors(data) {
  return async (dispatch) => {
    dispatch(assignInstructorsRequest());
    try {
      const response = await handleInstructorsEnrollment(data);
      dispatch(assignInstructorsSuccess(response.data));
    } catch (error) {
      dispatch(assignInstructorsFailed());
      logError(error);
    }
  };
}

/**
 * Add instructor to an institution.
 * @param {number} institutionId - The ID of the institution to which it will be assigned.
 * @param {FormData} instructorFormData - Instructor formData {instructorEmail, firstName, lastName}.
 * @returns {Promise<void>} - A promise that resolves after dispatching appropriate actions.
 */
function addInstructor(institutionId, instructorFormData) {
  return async (dispatch) => {
    dispatch(updateInstructorFormRequest({ status: RequestStatus.LOADING }));
    try {
      const { data } = await handleNewInstructor(institutionId, instructorFormData);
      dispatch(updateInstructorFormRequest({ status: RequestStatus.SUCCESS, data }));
    } catch (error) {
      let errors = '';
      const { customAttributes } = error || {};
      const { httpErrorResponseData, httpErrorStatus } = customAttributes || {};

      if (httpErrorStatus === 500) {
        errors = 'Error: The operation failed. Possible reasons: the user may already exist, or the server is temporarily unavailable.';
      } else if (typeof httpErrorResponseData === 'string') {
        const [[errorMessage]] = Object.values(JSON.parse(httpErrorResponseData)) ?? [['Internal server error']];
        errors = errorMessage;
      }

      dispatch(updateInstructorFormRequest({ status: RequestStatus.COMPLETE_WITH_ERRORS, error: errors }));
      throw error;
    } finally {
      dispatch(fetchInstructorsData(institutionId, initialPage, { active: true }));
    }
  };
}

function fetchEventsData(eventData, currentEvents = []) {
  return async (dispatch) => {
    dispatch(updateEventsRequestStatus(RequestStatus.LOADING));

    let allEvents = currentEvents;
    let page = 1;

    const fetchAllPages = async () => {
      try {
        const response = camelCaseObject(await getEventsByInstructor({ ...eventData, page }));
        const { results, next: existNextPage } = response.data;

        /* Filters out duplicate events from `results` based on `id`, `start`, and `end` properties
           when compared to `allEvents`. For the remaining unique events, adds a unique `elementId`
           by combining the current timestamp and a random number. */
        const uniqueResults = results
          .filter(newEvent => !allEvents.some(existingEvent => existingEvent.id === newEvent.id
              && existingEvent.start === newEvent.start
              && existingEvent.end === newEvent.end))
          .map(newEvent => ({
            ...newEvent,
            elementId: `${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
          }));

        allEvents = [...allEvents, ...uniqueResults];
        dispatch(updateEvents(allEvents));

        if (existNextPage) {
          page += 1;
          // eslint-disable-next-line no-promise-executor-return
          await new Promise((resolve) => setTimeout(resolve, 200));
          return fetchAllPages();
        }

        dispatch(updateEventsRequestStatus(RequestStatus.SUCCESS));
        return allEvents;
      } catch (error) {
        dispatch(updateEventsRequestStatus(RequestStatus.ERROR));
        return logError(error);
      }
    };

    return fetchAllPages();
  };
}

/**
 * The function fetches an instructor's profile information based on their email address and updates
 * the store accordingly.
 *
 * @param email - The `email` parameter in the `fetchInstructorProfile` function is the email address
 * of the instructor whose profile you want to fetch.
 * @param [options] - The `options` parameter is an object that can contain additional configuration settings.
 */
function fetchInstructorProfile(email, options = {}) {
  return async (dispatch) => {
    dispatch(updateInstructorInfoStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getInstructorByEmail(email, options));
      const instructorInfo = {
        ...response?.data[0] || {},
      };

      dispatch(updateInstructorInfo(instructorInfo));
      dispatch(updateInstructorInfoStatus(RequestStatus.SUCCESS));
    } catch (error) {
      logError(error);
      dispatch(updateInstructorInfoStatus(RequestStatus.ERROR));
    }
  };
}

/**
 * This function updates instructor information by dispatching a PATCH request
 * @param {Object} instructorInfo - The updated instructor information.
 * @param {number} instructorInfo.institution_id - The ID of the institution to which the instructor belongs.
 * @param {number} instructorInfo.instructor_id - The ID of the instructor to be edited.
 * @param {boolean} [instructorInfo.enrollment_privilege] - Whether the instructor has enrollment privileges.
 *
 * @returns {Function} A thunk function that dispatches async actions to update the instructor.
 */

function editInstructor(instructorInfo) {
  return async (dispatch) => {
    const institutionId = instructorInfo.get('institution_id');

    if (!institutionId) {
      logError(new Error('Missing institution'));
      return;
    }

    dispatch(updateInstructorFormRequest({ status: RequestStatus.LOADING }));

    try {
      await handleEditInstructor(instructorInfo);
      dispatch(updateInstructorFormRequest({ status: RequestStatus.SUCCESS }));
    } catch (error) {
      logError(error);

      dispatch(updateInstructorFormRequest({ status: RequestStatus.ERROR }));
    } finally {
      dispatch(fetchInstructorsData(institutionId, initialPage, { active: true }));
    }
  };
}

export {
  fetchInstructorsData,
  assignInstructors,
  addInstructor,
  fetchEventsData,
  fetchInstructorsOptionsData,
  fetchInstructorProfile,
  editInstructor,
};
