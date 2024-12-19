import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { handleInstructorsEnrollment, handleNewInstructor, getEventsByInstructor } from 'features/Instructors/data/api';
import { getInstructorByInstitution } from 'features/Common/data/api';
import {
  updateEvents,
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  assignInstructorsRequest,
  assignInstructorsSuccess,
  assignInstructorsFailed,
  updateEventsRequestStatus,
  updateInstructorAdditionRequest,
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
    dispatch(updateInstructorAdditionRequest({ status: RequestStatus.LOADING }));
    try {
      const { data } = await handleNewInstructor(institutionId, instructorFormData);
      dispatch(updateInstructorAdditionRequest({ status: RequestStatus.SUCCESS, data }));
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

      dispatch(updateInstructorAdditionRequest({ status: RequestStatus.COMPLETE_WITH_ERRORS, error: errors }));
      throw error;
    } finally {
      dispatch(fetchInstructorsData(institutionId, initialPage));
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

export {
  fetchInstructorsData,
  assignInstructors,
  addInstructor,
  fetchEventsData,
  fetchInstructorsOptionsData,
};
