import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';
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
      const { data } = camelCaseObject(await getInstitutionName());
      const sortedData = sortAlphabetically(data, 'name');
      dispatch(fetchInstitutionDataSuccess(sortedData));
    } catch (error) {
      dispatch(fetchInstitutionDataFailed());
      logError(error);
    }
  };
}

export {
  fetchInstitutionData,
};
