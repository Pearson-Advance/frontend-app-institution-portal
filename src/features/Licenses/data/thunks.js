import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';

import { getLicensesByInstitution } from 'features/Common/data/api';
import {
  fetchLicensesDataRequest,
  fetchLicensesDataSuccess,
  fetchLicensesDataFailed,
} from 'features/Licenses/data/slice';

function fetchLicensesData(id, currentPage) {
  return async (dispatch) => {
    dispatch(fetchLicensesDataRequest());
    try {
      const response = camelCaseObject(await getLicensesByInstitution(id, true, currentPage));
      dispatch(fetchLicensesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchLicensesDataFailed());
      logError(error);
    }
  };
}

export {
  fetchLicensesData,
};
