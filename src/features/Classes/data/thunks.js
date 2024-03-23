import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  updateClassesOptions,
} from 'features/Classes/data/slice';
import { getClassesByInstitution } from 'features/Common/data/api';

function fetchClassesData(id, currentPage, courseName = '', urlParamsFilters = '', limit = true) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());

    try {
      const response = camelCaseObject(
        await getClassesByInstitution(id, courseName, limit, currentPage, urlParamsFilters),
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

export {
  fetchClassesData,
  fetchClassesOptionsData,
};
