import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { getInstructorData, getCCXList, handleInstructorsEnrollment } from 'features/Instructors/data/api';
import { getCoursesByInstitution } from 'features/Common/data/api';
import {
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  assingInstructorsRequest,
  assingInstructorsSuccess,
  assingInstructorsFailed,
} from 'features/Instructors/data/slice';
import { fetchClassesData as fetchClassesDataHome } from 'features/Dashboard/data';

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

function fetchClassesData() {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());
    try {
      const response = camelCaseObject(await getCCXList());
      dispatch(fetchClassesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

function assignInstructors(data, classId, institutionId) {
  return async (dispatch) => {
    dispatch(assingInstructorsRequest());
    try {
      const response = await handleInstructorsEnrollment(data, classId);
      dispatch(assingInstructorsSuccess(response.data));
    } catch (error) {
      dispatch(assingInstructorsFailed());
      logError(error);
    } finally {
      dispatch(fetchClassesDataHome(institutionId, false));
    }
  };
}

export {
  fetchInstructorsData,
  fetchCoursesData,
  fetchClassesData,
  assignInstructors,
};
