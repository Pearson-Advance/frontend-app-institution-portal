import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

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
import { handleNewClass, handleEditClass, handleDeleteClass } from 'features/Courses/data/api';
import { assignInstructors } from 'features/Instructors/data';

function fetchCoursesData(id, currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchCoursesDataRequest());

    try {
      const response = camelCaseObject(await getCoursesByInstitution(id, true, currentPage, filtersData));
      const sortedCourses = sortAlphabetically(response.data.results);

      const courses = {
        ...response.data,
        results: sortedCourses,
      };

      dispatch(fetchCoursesDataSuccess(courses));
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
      const sortedResponse = sortAlphabetically(response.data);

      dispatch(updateCoursesOptions(sortedResponse));
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
        await dispatch(assignInstructors(instructorData));
      }
      dispatch(updateNotificationMsg(`${response.data.name} has been added successfully!`));
      return response;
    } catch (error) {
      dispatch(newClassFailed());
      logError(error);
      return dispatch(updateNotificationMsg(error?.response?.data?.detail));
    }
  };
}

function editClass(classData) {
  return async (dispatch) => {
    dispatch(newClassRequest());
    try {
      const response = await handleEditClass(classData);
      dispatch(newClassSuccess(response.data));
      dispatch(updateNotificationMsg('Class updated successfully'));
    } catch (error) {
      dispatch(newClassFailed());
      logError(error);
      dispatch(updateNotificationMsg('Class could not be updated'));
    }
  };
}

function deleteClass(classId) {
  return async (dispatch) => {
    dispatch(newClassRequest());
    try {
      const response = await handleDeleteClass(classId);
      dispatch(newClassSuccess(response.data));
      dispatch(updateNotificationMsg('Class Deleted successfully'));
    } catch (error) {
      dispatch(newClassFailed());
      logError(error);
      dispatch(updateNotificationMsg('Class could not be deleted'));
    }
  };
}

export {
  deleteClass,
  fetchCoursesData,
  fetchCoursesOptionsData,
  addClass,
  editClass,
};
