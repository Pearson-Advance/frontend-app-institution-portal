import { getStudentbyInstitutionAdmin } from 'features/Students/data/api'

export const fetchStudentEnrollments = async (dispatch) => {
  dispatch({ type: 'FETCH_REQUEST' });

  try {
    const response = await getStudentbyInstitutionAdmin();
    dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_FAILURE', payload: error });
  }
};
