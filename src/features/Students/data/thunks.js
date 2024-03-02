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
  fetchClassesMetricsDataRequest,
  fetchClassesMetricsDataSuccess,
  fetchClassesMetricsDataFailed,
  fetchStudentsMetricsDataRequest,
  fetchStudentsMetricsDataSuccess,
  fetchStudentsMetricsDataFailed,
} from 'features/Students/data/slice';
import {
  getClassesMetrics,
  getStudentsMetrics,
  getStudentbyInstitutionAdmin,
} from 'features/Students/data/api';
import { getCoursesByInstitution, getClassesByInstitution } from 'features/Common/data/api';

function fetchStudentsData(id, currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchStudentsDataRequest());

    try {
      const response = camelCaseObject(await getStudentbyInstitutionAdmin(id, currentPage, filtersData));
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

function fetchClassesMetricsData(institutionId, days) {
  return async (dispatch) => {
    dispatch(fetchClassesMetricsDataRequest());

    try {
      const response = camelCaseObject(await getClassesMetrics(institutionId, days));
      dispatch(fetchClassesMetricsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchClassesMetricsDataFailed());
      logError(error);
    }
  };
}

function fetchStudentsMetricsData(institutionId, days) {
  return async (dispatch) => {
    dispatch(fetchStudentsMetricsDataRequest());

    try {
      const response = camelCaseObject(await getStudentsMetrics(institutionId, days));
      dispatch(fetchStudentsMetricsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchStudentsMetricsDataFailed());
      logError(error);
    }
  };
}

export {
  fetchStudentsData,
  fetchCoursesData,
  fetchClassesData,
  fetchClassesMetricsData,
  fetchStudentsMetricsData,
};
