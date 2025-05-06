import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import {
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  updateClassesOptions,
  fetchAllClassesDataRequest,
  fetchAllClassesDataSuccess,
  fetchAllClassesDataFailed,
} from 'features/Classes/data/slice';

import { handleSkillableDashboard, handleXtremeLabsDashboard } from 'features/Classes/data/api';
import { getClassesByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

function fetchClassesData(id, currentPage, courseId = '', urlParamsFilters = '', limit = true) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());

    try {
      const response = camelCaseObject(
        await getClassesByInstitution(id, courseId, limit, currentPage, urlParamsFilters),
      );
      const sortedData = sortAlphabetically(response.data.results, 'className');
      const classes = {
        ...response.data,
        results: sortedData,
      };

      dispatch(fetchClassesDataSuccess(classes));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

function fetchClassesOptionsData(id, courseId) {
  return async (dispatch) => {
    dispatch(fetchClassesDataRequest());

    try {
      const response = camelCaseObject(await getClassesByInstitution(id, courseId, false));
      const sortedData = sortAlphabetically(response.data, 'className');

      dispatch(updateClassesOptions(sortedData));
    } catch (error) {
      dispatch(fetchClassesDataFailed());
      logError(error);
    }
  };
}

function fetchAllClassesData(id, courseId = '', urlParamsFilters = '', limit = false) {
  return async (dispatch) => {
    dispatch(fetchAllClassesDataRequest());

    try {
      const response = camelCaseObject(
        await getClassesByInstitution(id, courseId, limit, initialPage, urlParamsFilters),
      );
      const sortedData = sortAlphabetically(response.data, 'className');

      dispatch(fetchAllClassesDataSuccess(sortedData));
    } catch (error) {
      dispatch(fetchAllClassesDataFailed());
      logError(error);
    }
  };
}

function fetchLabSummaryLink(classId, labSummaryTag, showToast) {
  return async () => {
    try {
      const labDashboardOptions = {
        'skillable-dashboard': handleSkillableDashboard,
        'xtreme-labs-dashboard': handleXtremeLabsDashboard,
      };

      const fetchDashboard = labDashboardOptions[labSummaryTag];

      if (!fetchDashboard) {
        throw new Error(`Unsupported lab summary tag: ${labSummaryTag}`);
      }

      const response = await fetchDashboard(classId);

      const url = response?.data?.url || response?.data?.redirect_to;

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const errorMessage = response?.data?.message || response?.data?.error;
        throw new Error(errorMessage);
      }
    } catch (error) {
      showToast(error.message || 'An unexpected error occurred.');
      logError(error);
    }
  };
}

export {
  fetchClassesData,
  fetchClassesOptionsData,
  fetchAllClassesData,
  fetchLabSummaryLink,
};
