import {
  FETCH_COURSES_DATA_FAILURE,
  FETCH_COURSES_DATA_REQUEST,
  FETCH_COURSES_DATA_SUCCESS,
} from 'features/Instructors/actionTypes';
import { RequestStatus } from 'features/constants';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_COURSES_DATA_REQUEST:
      return {
        ...state,
        courses: {
          ...state.courses,
          status: RequestStatus.LOADING,
        },
      };
    case FETCH_COURSES_DATA_SUCCESS:
      return {
        ...state,
        courses: {
          ...state.courses,
          status: RequestStatus.SUCCESS,
          data: action.payload,
        },
      };
    case FETCH_COURSES_DATA_FAILURE:
      return {
        ...state,
        courses: {
          ...state.courses,
          status: RequestStatus.ERROR,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default reducer;
