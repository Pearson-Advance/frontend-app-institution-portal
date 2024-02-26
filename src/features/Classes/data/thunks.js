import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
} from 'features/Classes/data/slice';
import { getClassesByInstitution } from 'features/Common/data/api';

function fetchClassesData(id, currentPage, courseName = '') {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest);

    try {
      const response = camelCaseObject(await getClassesByInstitution(id, courseName, true, '', currentPage));
      dispatch(fetchClassesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

export {
  fetchClassesData,
};
