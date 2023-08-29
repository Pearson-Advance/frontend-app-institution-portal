import {
  getStudentbyInstitutionAdmin,
  handleEnrollments,
} from 'features/Students/data/api'

const fetchStudentEnrollments = async (dispatch, currentPage, filters) => {
  dispatch({ type: 'FETCH_REQUEST' });

  try {
    const response = await getStudentbyInstitutionAdmin(currentPage, filters);
    dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_FAILURE', payload: error });
  }
};

const updateEnrollmentAction = async (dispatch, currentPage, data, filters, courseId) => {
  dispatch({ type: 'FETCH_REQUEST' });

  try {
    await handleEnrollments(data, courseId);
    const response = await getStudentbyInstitutionAdmin(currentPage, filters);
    dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_FAILURE', payload: error });
  }
}

export {
  fetchStudentEnrollments,
  updateEnrollmentAction,
}
