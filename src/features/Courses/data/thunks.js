import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
} from 'features/Courses/data/slice';
import { getCoursesByInstitution } from 'features/Common/data/api';

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

export {
  fetchCoursesData,
};
