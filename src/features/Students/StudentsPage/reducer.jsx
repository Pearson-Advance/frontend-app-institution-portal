import {
  FETCH_STUDENTS_DATA_REQUEST,
  FETCH_STUDENTS_DATA_SUCCESS,
  FETCH_STUDENTS_DATA_FAILURE,
  UPDATE_CURRENT_PAGE,
} from 'features/Students/actionTypes';
import { RequestStatus } from 'features/constants';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_STUDENTS_DATA_REQUEST:
      return { ...state, status: RequestStatus.LOADING };
    case FETCH_STUDENTS_DATA_SUCCESS: {
      const { results, count, numPages } = action.payload;
      return {
        ...state,
        status: RequestStatus.SUCCESS,
        data: results,
        numPages,
        count,
      };
    }
    case FETCH_STUDENTS_DATA_FAILURE:
      return {
        ...state,
        status: RequestStatus.ERROR,
        error: action.payload,
      };
    case UPDATE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
