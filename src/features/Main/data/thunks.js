import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { getInstitutionName } from 'features/Main/data/api';
import {
  fetchInstitutionDataRequest,
  fetchInstitutionDataSuccess,
  fetchInstitutionDataFailed,
} from 'features/Main/data/slice';

function fetchInstitutionData() {
  return async (dispatch) => {
    dispatch(fetchInstitutionDataRequest());
    try {
      const response = camelCaseObject(await getInstitutionName());
      dispatch(fetchInstitutionDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchInstitutionDataFailed());
      logError(error);
    }
  };
}

export {
  fetchInstitutionData,
};
