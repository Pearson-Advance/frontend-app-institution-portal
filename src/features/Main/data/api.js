import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getInstitutionName() {
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/institutions/?limit=false`,
  );
}

/**
 * Assigns a staff role to a class.
 *
 * This function makes an authenticated HTTP request to the COURSE_OPERATIONS_API_V2
 * to assign a staff role to the specified class ID.
 *
 * @param {string} classId - The ID of the class to which the staff role will be assigned.
 * @returns {Promise} A promise that resolves with the HTTP response of the request.
 */
function assignStaffRole(classId) {
  const formData = new FormData();
  formData.append('class_id', classId);

  return getAuthenticatedHttpClient().post(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/assign-staff/`,
    formData,
  );
}

function deleteEnrollment(studentEmail, classId) {
  const BASE_URL = getConfig().LMS_BASE_URL;

  const formData = new FormData();
  formData.append('identifiers', studentEmail);
  formData.append('action', 'unenroll');

  return getAuthenticatedHttpClient().post(
    `${BASE_URL}/courses/${classId}/instructor/api/students_update_enrollment`,
    formData,
  );
}

export {
  getInstitutionName,
  assignStaffRole,
  deleteEnrollment,
};
