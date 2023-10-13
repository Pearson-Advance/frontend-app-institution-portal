import {
  FETCH_CCX_LIST_FAILURE,
  FETCH_CCX_LIST_REQUEST,
  FETCH_CCX_LIST_SUCCESS,
} from 'features/Instructors/actionTypes';
import { RequestStatus } from 'features/constants';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_CCX_LIST_REQUEST:
      return { ...state, status: RequestStatus.LOADING };
    case FETCH_CCX_LIST_SUCCESS: {
      return {
        ...state,
        status: RequestStatus.SUCCESS,
        data: action.payload,
      };
    }
    case FETCH_CCX_LIST_FAILURE:
      return {
        ...state,
        status: RequestStatus.ERROR,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
