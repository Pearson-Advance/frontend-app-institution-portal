import {
  FETCH_INSTITUTION_DATA_REQUEST,
  FETCH_INSTITUTION_DATA_SUCCESS,
  FETCH_INSTITUTION_DATA_FAILURE,
} from 'features/Main/actionTypes';
import { RequestStatus } from 'features/constants';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_INSTITUTION_DATA_REQUEST:
      return { ...state, status: RequestStatus.LOADING };
    case FETCH_INSTITUTION_DATA_SUCCESS:
      return {
        ...state,
        status: RequestStatus.SUCCESS,
        data: action.payload,
      };
    case FETCH_INSTITUTION_DATA_FAILURE:
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
