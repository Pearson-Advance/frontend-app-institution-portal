import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  updateCoursesOptions,
  newClassRequest,
  newClassSuccess,
  newClassFailed,
  updateNotificationMsg,
} from 'features/Courses/data/slice';
import { getCoursesByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';
import { handleNewClass } from 'features/Courses/data/api';
import { assignInstructors } from 'features/Instructors/data';

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

function addClass(classData, instructorData) {
  return async (dispatch) => {
    dispatch(newClassRequest());
    try {
      const response = await handleNewClass(classData);
      dispatch(newClassSuccess(response.data));
      if (Array.from(instructorData.keys()).length > 0) {
        instructorData.append('class_id', response.data.class_id);
        dispatch(assignInstructors(instructorData));
      }
      dispatch(updateNotificationMsg(`${response.data.name} has been added successfullly!`));
    } catch (error) {
      dispatch(newClassFailed());
      logError(error);
      dispatch(updateNotificationMsg(error?.response?.data?.detail));
    }
  };
}

export {
  fetchCoursesData,
  fetchCoursesOptionsData,
  addClass,
};
