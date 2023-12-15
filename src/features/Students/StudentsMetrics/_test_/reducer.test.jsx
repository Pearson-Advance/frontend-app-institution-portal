import {
  FETCH_METRICS_DATA_REQUEST,
  FETCH_METRICS_DATA_SUCCESS,
  FETCH_METRICS_DATA_FAILURE,
} from 'features/Students/actionTypes';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Students/StudentsMetrics/reducer';

describe('Student filter reducers', () => {
  const initialState = {
    data: [],
    status: RequestStatus.SUCCESS,
    error: null,
  };

  test('should handle FETCH_METRICS_DATA_REQUEST', () => {
    const state = {
      ...initialState,
      status: RequestStatus.LOADING,
    };
    const action = {
      type: FETCH_METRICS_DATA_REQUEST,
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_METRICS_DATA_SUCCESS', () => {
    const state = {
      ...initialState,
      status: RequestStatus.SUCCESS,
      data: [],
    };
    const action = {
      type: FETCH_METRICS_DATA_SUCCESS,
      payload: [],
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_METRICS_DATA_FAILURE', () => {
    const state = {
      ...initialState,
      status: RequestStatus.ERROR,
      error: '',
    };
    const action = {
      type: FETCH_METRICS_DATA_FAILURE,
      payload: '',
    };
    expect(reducer(state, action)).toEqual(state);
  });
});
