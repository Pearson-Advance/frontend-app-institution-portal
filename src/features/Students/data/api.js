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

function getClassesByInstitution(institutionId, courseName) {
  const encodedCourseName = encodeURIComponent(courseName);

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/classes`
    + `/?limit=false&institution_id=${institutionId}&course_name=${encodedCourseName}`,
  );
}

export {
  getStudentbyInstitutionAdmin,
  handleEnrollments,
  getClassesByInstitution,
};
