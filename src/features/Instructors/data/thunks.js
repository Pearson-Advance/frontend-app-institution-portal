import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { getInstructorData, handleInstructorsEnrollment, handleNewInstructor } from 'features/Instructors/data/api';
import { getCoursesByInstitution } from 'features/Common/data/api';
import {
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  assignInstructorsRequest,
  assignInstructorsSuccess,
  assignInstructorsFailed,
  addInstructorRequest,
  addInstructorSuccess,
  addInstructorFailed,
} from 'features/Instructors/data/slice';
import { initialPage } from 'features/constants';

function fetchInstructorsData(id, currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchInstructorsDataRequest());
    try {
      const response = camelCaseObject(await getInstructorData(id, currentPage, filtersData));
      dispatch(fetchInstructorsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchInstructorsDataFailed());
      logError(error);
    }
  };
}

function fetchCoursesData(id) {
  return async (dispatch) => {
    try {
      dispatch(fetchCoursesDataRequest());
      const response = camelCaseObject(await getCoursesByInstitution(id, false));
      dispatch(fetchCoursesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchCoursesDataFailed());
      logError(error);
    }
  };
}

/**
 * Assign instructors to a class.
 * @param {Object} data - The data containing information about the instructors to be assigned.
 * @param {string} classId - The ID of the class to which the instructors will be assigned.
 * @returns {Promise<void>} - A promise that resolves after dispatching appropriate actions.
 */
function assignInstructors(data, classId) {
  return async (dispatch) => {
    dispatch(assignInstructorsRequest());
    try {
      const response = await handleInstructorsEnrollment(data, classId);
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
  fetchCoursesData,
  assignInstructors,
  addInstructor,
};
