import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  updateCoursesOptions,
} from 'features/Courses/data/slice';
import { getCoursesByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

function fetchCoursesData(id, currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchCoursesDataRequest);

    try {
      const response = camelCaseObject(await getCoursesByInstitution(id, true, currentPage, filtersData));
      dispatch(fetchCoursesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchCoursesDataFailed());
      logError(error);
    }
  };
}

function fetchCoursesOptionsData(institutionId, limit = false, page = initialPage, params = {}) {
  return async (dispatch) => {
    dispatch(fetchCoursesDataRequest);

    try {
      const response = camelCaseObject(await getCoursesByInstitution(institutionId, limit, page, params));
      dispatch(updateCoursesOptions(response.data));
    } catch (error) {
      dispatch(fetchCoursesDataFailed());
      logError(error);
    }
  };
}

export {
  fetchCoursesData,
  fetchCoursesOptionsData,
};
