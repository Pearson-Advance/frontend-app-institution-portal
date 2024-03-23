import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { handleInstructorsEnrollment, handleNewInstructor } from 'features/Instructors/data/api';
import { getInstructorByInstitution } from 'features/Common/data/api';
import {
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  assignInstructorsRequest,
  assignInstructorsSuccess,
  assignInstructorsFailed,
  addInstructorRequest,
  addInstructorSuccess,
  addInstructorFailed,
  updateInstructorOptions,
} from 'features/Instructors/data/slice';
import { initialPage } from 'features/constants';

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
    dispatch(fetchInstructorsDataRequest());
    try {
      const response = camelCaseObject(await getInstructorByInstitution(id, currentPage, filtersData));
      dispatch(updateInstructorOptions(response.data));
    } catch (error) {
      dispatch(fetchInstructorsDataFailed());
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
 * @param {string} instructorEmail - The instructor email to be added.
 * @returns {Promise<void>} - A promise that resolves after dispatching appropriate actions.
 */
function addInstructor(institutionId, instructorEmail) {
  return async (dispatch) => {
    dispatch(addInstructorRequest());
    try {
      const response = await handleNewInstructor(institutionId, instructorEmail);
      dispatch(addInstructorSuccess(response.data));
    } catch (error) {
      dispatch(addInstructorFailed());
      logError(error);
    } finally {
      dispatch(fetchInstructorsData(institutionId, initialPage));
    }
  };
}

export {
  fetchInstructorsData,
  assignInstructors,
  addInstructor,
  fetchInstructorsOptionsData,
};
