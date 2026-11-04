import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';

import { getLicensesByInstitution } from 'features/Common/data/api';
import { withMockLicensePools, DUMMY_LICENSE_POOLS } from 'features/Licenses/data/mocks';
import {
  fetchLicensesDataRequest,
  fetchLicensesDataSuccess,
  fetchLicensesDataFailed,
  updateLicensesOptions,
} from 'features/Licenses/data/slice';

function fetchLicensesData(id, currentPage, urlParamsFilters) {
  return async (dispatch, getState) => {
    dispatch(fetchLicensesDataRequest());
    try {
      const response = camelCaseObject(await getLicensesByInstitution(id, true, currentPage, urlParamsFilters));
      const { data } = response;
      // Only when the institution has Offerings enabled: layer mock fields over
      // the API response and append the dummy pools used for testing.
      const offeringsEnabled = Boolean(getConfig().PSS_ENABLE_OFFERINGS)
        && Boolean(getState().main.selectedInstitution?.hasOfferings);
      const payload = offeringsEnabled
        ? {
          ...data,
          results: withMockLicensePools(data.results),
          count: (data.count ?? 0) + DUMMY_LICENSE_POOLS.length,
        }
        : data;
      dispatch(fetchLicensesDataSuccess(payload));
    } catch (error) {
      dispatch(fetchLicensesDataFailed());
      logError(error);
    }
  };
}

function fetchLicensesOptionsData(id) {
  return async (dispatch) => {
    dispatch(fetchLicensesDataRequest());
    try {
      const response = camelCaseObject(await getLicensesByInstitution(id, false));
      dispatch(updateLicensesOptions(response.data));
    } catch (error) {
      dispatch(fetchLicensesDataFailed());
      logError(error);
    }
  };
}

export {
  fetchLicensesData,
  fetchLicensesOptionsData,
};
