import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getStudentbyInstitutionAdmin(page, filters) {
  const params = {
    page,
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

function getMetricsStudents() {
  const metricsData = {
    data: {
      new_students_registered: '367',
      classes_scheduled: '71%',
    },
  };
  return metricsData;
}

export {
  getStudentbyInstitutionAdmin,
  handleEnrollments,
  getMetricsStudents,
};
