import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import { getLicensesByInstitution, getClassesByInstitution } from 'features/Common/data/api';
import {
  fetchLicensesDataRequest,
  fetchLicensesDataSuccess,
  fetchLicensesDataFailed,
  fetchClassesNoInstructorsDataRequest,
  fetchClassesNoInstructorsDataSuccess,
  fetchClassesNoInstructorsDataFailed,
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

function fetchClassesData(id, hasInstructors = false) {
  return async (dispatch) => {
    // eslint-disable-next-line no-unused-expressions
    hasInstructors ? dispatch(fetchClassesDataRequest()) : dispatch(fetchClassesNoInstructorsDataRequest());
    try {
      if (hasInstructors) {
        const response = camelCaseObject(await getClassesByInstitution(id, '', false));
        const sortedData = sortAlphabetically(response.data, 'className');

        dispatch(fetchClassesDataSuccess(sortedData));
      } else {
        const instructorsNull = { instructors: 'null' };
        const response = camelCaseObject(await getClassesByInstitution(id, '', false, '', instructorsNull));
        const sortedData = sortAlphabetically(response.data, 'className');

        dispatch(fetchClassesNoInstructorsDataSuccess(sortedData));
      }
    } catch (error) {
      // eslint-disable-next-line no-unused-expressions
      hasInstructors ? dispatch(fetchClassesDataFailed()) : dispatch(fetchClassesNoInstructorsDataFailed());
      logError(error);
    }
  };
}

export {
  fetchLicensesData,
  fetchClassesData,
};
