import {
    getInstitutionName,
  } from 'features/Main/data/api'


const fetchInstitutionName = async (dispatch) => {
    dispatch({ type: 'FETCH_REQUEST' });
  
    try {
      const response = await getInstitutionName();
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
    }
  };

  export {
    fetchInstitutionName,
  }
