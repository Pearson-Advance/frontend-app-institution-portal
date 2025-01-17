import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

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
      const sortedData = sortAlphabetically(response.data.results, 'className');
      const classes = {
        ...response.data,
        results: sortedData,
      };

      dispatch(fetchClassesDataSuccess(classes));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

function fetchClassesOptionsData(id, courseId) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());

    try {
      const response = camelCaseObject(await getClassesByInstitution(id, courseId, false));
      const sortedData = sortAlphabetically(response.data, 'className');

      dispatch(updateClassesOptions(sortedData));
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
      const sortedData = sortAlphabetically(response.data, 'className');

      dispatch(fetchAllClassesDataSuccess(sortedData));
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
