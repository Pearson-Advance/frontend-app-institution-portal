import { getStudentbyInstitutionAdmin } from 'features/Students/data/api'

export const fetchStudentEnrollments = async (dispatch, currentPage, filters) => {
  dispatch({ type: 'FETCH_REQUEST' });

  try {
    const response = await getStudentbyInstitutionAdmin(currentPage, filters);
    dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_FAILURE', payload: error });
  }
};
