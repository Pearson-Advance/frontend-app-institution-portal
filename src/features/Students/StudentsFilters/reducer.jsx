import {
  FETCH_COURSES_DATA_FAILURE,
  FETCH_COURSES_DATA_REQUEST,
  FETCH_COURSES_DATA_SUCCESS,
  FETCH_CLASSES_DATA_REQUEST,
  FETCH_CLASSES_DATA_SUCCESS,
  FETCH_CLASSES_DATA_FAILURE,
} from 'features/Students/actionTypes';
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
    case FETCH_CLASSES_DATA_REQUEST:
      return {
        ...state,
        classes: {
          ...state.classes,
          status: RequestStatus.LOADING,
        },
      };
    case FETCH_CLASSES_DATA_SUCCESS:
      return {
        ...state,
        classes: {
          ...state.classes,
          status: RequestStatus.SUCCESS,
          data: action.payload,
        },
      };
    case FETCH_CLASSES_DATA_FAILURE:
      return {
        ...state,
        classes: {
          ...state.classes,
          status: RequestStatus.ERROR,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default reducer;
