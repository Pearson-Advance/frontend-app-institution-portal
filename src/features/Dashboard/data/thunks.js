import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';

import { getLicensesByInstitution, getClassesByInstitution } from 'features/Common/data/api';
import {
  fetchLicensesDataRequest,
  fetchLicensesDataSuccess,
  fetchLicensesDataFailed,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
} from 'features/Dashboard/data/slice';

function fetchLicensesData(id) {
  return async (dispatch) => {
    dispatch(fetchLicensesDataRequest());
    try {
      const response = camelCaseObject(await getLicensesByInstitution(id, false));
      dispatch(fetchLicensesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchLicensesDataFailed());
      logError(error);
    }
  };
}

function fetchClassesData(id) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());
    try {
      const response = camelCaseObject(await getClassesByInstitution(id, '', false, 'null'));
      dispatch(fetchClassesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

export {
  fetchLicensesData,
  fetchClassesData,
};
