import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { MAX_TABLE_RECORDS } from 'features/constants';

function getStudentbyInstitutionAdmin(institutionId, page, filters) {
  const params = {
    page,
    page_size: MAX_TABLE_RECORDS,
    institution_id: institutionId,
    ...filters,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/students/`,
    { params },
  );
}

function handleEnrollments(data, courseId) {
  const INSTRUCTOR_API_URL = `${getConfig().LMS_BASE_URL}/courses/course_id/instructor/api`;
  const courseIdSearchPattern = /course_id/;

  return getAuthenticatedHttpClient().post(
    `${INSTRUCTOR_API_URL.replace(courseIdSearchPattern, courseId)}/students_update_enrollment`,
    data,
  );
}

function getMessages() {
  return getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/pearson_course_operation/api/messages/get-messages/`,
  );
}

function getStudentsMetrics(institutionId, days) {
  const params = {
    institution_id: institutionId,
    days,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_METRICS_BASE_URL}/students-number/`,
    { params },
  );
}

function getClassesMetrics(institutionId, days) {
  const params = {
    institution_id: institutionId,
    days,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_METRICS_BASE_URL}/classes-number/`,
    { params },
  );
}

/**
 * Retrieves student information based on their email address.
 *
 * @param {String} studentEmail - Email address of the student for whom you
 *                                want to retrieve information.
 * @param {Object} [options] - Extra options to pass to the API.:
 */
function getStudentsByEmail(studentEmail, options = {}) {
  const params = {
    learner_email: studentEmail,
    ...options,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/students/`,
    { params },
  );
}

export {
  getStudentbyInstitutionAdmin,
  handleEnrollments,
  getStudentsMetrics,
  getClassesMetrics,
  getMessages,
  getStudentsByEmail,
};
