import {
  FETCH_METRICS_DATA_REQUEST,
  FETCH_METRICS_DATA_SUCCESS,
  FETCH_METRICS_DATA_FAILURE,
} from 'features/Students/actionTypes';
import { RequestStatus } from 'features/constants';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_METRICS_DATA_REQUEST:
      return {
        ...state,
        status: RequestStatus.LOADING,
      };
    case FETCH_METRICS_DATA_SUCCESS:
      return {
        ...state,
        status: RequestStatus.SUCCESS,
        data: action.payload,
      };
    case FETCH_METRICS_DATA_FAILURE:
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
