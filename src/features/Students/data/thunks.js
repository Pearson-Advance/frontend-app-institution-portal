import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  updateStudentProfile,
  updateStudentProfileStatus,
  fetchStudentsDataRequest,
  fetchStudentsDataSuccess,
  fetchStudentsDataFailed,
  fetchClassesMetricsDataRequest,
  fetchClassesMetricsDataSuccess,
  fetchClassesMetricsDataFailed,
  fetchStudentsMetricsDataRequest,
  fetchStudentsMetricsDataSuccess,
  fetchStudentsMetricsDataFailed,
} from 'features/Students/data/slice';
import {
  getClassesMetrics,
  getStudentsMetrics,
  getStudentsByEmail,
  getStudentbyInstitutionAdmin,
  getInstitutionVouchers,
} from 'features/Students/data/api';
import { RequestStatus } from 'features/constants';

function fetchStudentsData(id, currentPage, filtersData) {
  return async (dispatch) => {
    dispatch(fetchStudentsDataRequest());

    const studentFilters = {
      course_id: filtersData.course_id,
      class_id: filtersData.class_id,
      limit: true,
    };

    const voucherFilters = {
      course_id: filtersData.course_id,
      exam_series_code: filtersData.exam_series_code,
      status: 'Available',
    };

    try {
      const [vouchers, students] = await Promise.all([
        getInstitutionVouchers(voucherFilters).then(camelCaseObject),
        getStudentbyInstitutionAdmin(id, currentPage, studentFilters).then(camelCaseObject),
      ]);

      const results = students.data.results.map((student) => ({
        ...student,
        isVoucherAvailable: vouchers.data.results.some((voucher) => voucher.user === student.learnerEmail),
      }));

      dispatch(fetchStudentsDataSuccess({ ...students.data, results }));
    } catch (error) {
      dispatch(fetchStudentsDataFailed());
      logError(error);
    }
  };
}

function fetchClassesMetricsData(institutionId, days) {
  return async (dispatch) => {
    dispatch(fetchClassesMetricsDataRequest());

    try {
      const response = camelCaseObject(await getClassesMetrics(institutionId, days));
      dispatch(fetchClassesMetricsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchClassesMetricsDataFailed());
      logError(error);
    }
  };
}

function fetchStudentsMetricsData(institutionId, days) {
  return async (dispatch) => {
    dispatch(fetchStudentsMetricsDataRequest());

    try {
      const response = camelCaseObject(await getStudentsMetrics(institutionId, days));
      dispatch(fetchStudentsMetricsDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchStudentsMetricsDataFailed());
      logError(error);
    }
  };
}
/**
 * The function fetches a student's profile using their email and updates the profile status
 * accordingly.
 *
 * @param {String} studentEmail -The email of the student whose profile you want to fetch.
 * @param {Object} [options] - Extra options to pass to the API.
 */

function fetchStudentProfile(studentEmail, options = {}) {
  return async (dispatch) => {
    dispatch(updateStudentProfileStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getStudentsByEmail(studentEmail, options));

      // IF no results are returned, set the status to ERROR
      if (response.data.results.length === 0) {
        return dispatch(updateStudentProfileStatus(RequestStatus.ERROR));
      }

      const studentInfo = {
        ...response.data.results[0] || {},
      };

      dispatch(updateStudentProfile(studentInfo));
      return dispatch(updateStudentProfileStatus(RequestStatus.INITIAL));
    } catch (error) {
      logError(error);
      return dispatch(updateStudentProfileStatus(RequestStatus.ERROR));
    }
  };
}

export {
  fetchStudentsData,
  fetchStudentProfile,
  fetchClassesMetricsData,
  fetchStudentsMetricsData,
};
