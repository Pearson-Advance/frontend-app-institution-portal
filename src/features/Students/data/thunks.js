import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchStudentsDataRequest,
  fetchStudentsDataSuccess,
  fetchStudentsDataFailed,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  fetchMetricsDataRequest,
  fetchMetricsDataSuccess,
  fetchMetricsDataFailed,
} from 'features/Students/data/slice';
import { getStudentbyInstitutionAdmin, getMetricsStudents } from 'features/Students/data/api';
import { getCoursesByInstitution, getClassesByInstitution } from 'features/Common/data/api';

function fetchStudentsData(currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchStudentsDataRequest());

    try {
      const response = camelCaseObject(await getStudentbyInstitutionAdmin(currentPage, filtersData));
      dispatch(fetchStudentsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchStudentsDataFailed());
      logError(error);
    }
  };
}

function fetchCoursesData(id) {
  return async (dispatch) => {
    dispatch(fetchCoursesDataRequest());

    try {
      const response = camelCaseObject(await getCoursesByInstitution(id, false));
      dispatch(fetchCoursesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchCoursesDataFailed());
      logError(error);
    }
  };
}

function fetchClassesData(id, courseName) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());

    try {
      const response = camelCaseObject(await getClassesByInstitution(id, courseName, false));
      dispatch(fetchClassesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

function fetchMetricsData() {
  return async (dispatch) => {
    dispatch(fetchMetricsDataRequest());

    try {
      const response = camelCaseObject(await getMetricsStudents());
      dispatch(fetchMetricsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchMetricsDataFailed());
      logError(error);
    }
  };
}

export {
  fetchStudentsData,
  fetchCoursesData,
  fetchClassesData,
  fetchMetricsData,
};
