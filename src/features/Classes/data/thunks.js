import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  updateClassesOptions,
  fetchAllClassesDataRequest,
  fetchAllClassesDataSuccess,
  fetchAllClassesDataFailed,
} from 'features/Classes/data/slice';

import { getClassesByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

function fetchClassesData(id, currentPage, courseId = '', urlParamsFilters = '', limit = true) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());

    try {
      const response = camelCaseObject(
        await getClassesByInstitution(id, courseId, limit, currentPage, urlParamsFilters),
      );
      dispatch(fetchClassesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

function fetchClassesOptionsData(id, courseName) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());

    try {
      const response = camelCaseObject(await getClassesByInstitution(id, courseName, false));
      dispatch(updateClassesOptions(response.data));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

function fetchAllClassesData(id, courseId = '', urlParamsFilters = '', limit = false) {
  return async (dispatch) => {
    dispatch(fetchAllClassesDataRequest());

    try {
      const response = camelCaseObject(
        await getClassesByInstitution(id, courseId, limit, initialPage, urlParamsFilters),
      );
      dispatch(fetchAllClassesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchAllClassesDataFailed());
      logError(error);
    }
  };
}

export {
  fetchClassesData,
  fetchClassesOptionsData,
  fetchAllClassesData,
};
