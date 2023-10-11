import {
  FETCH_CCX_LIST_FAILURE,
  FETCH_CCX_LIST_REQUEST,
  FETCH_CCX_LIST_SUCCESS,
} from 'features/Instructors/actionTypes';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Instructors/InstructorsPage/reducer';

describe('Instructor page reducers', () => {
  const initialState = {
    data: [],
    error: null,
  };

  test('should handle FETCH_CCX_LIST_REQUEST', () => {
    const state = {
      ...initialState,
      status: RequestStatus.LOADING,
    };
    const action = {
      type: FETCH_CCX_LIST_REQUEST,
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_CCX_LIST_SUCCESS', () => {
    const state = {
      ...initialState,
      status: RequestStatus.SUCCESS,
      count: 0,
    };
    const action = {
      type: FETCH_CCX_LIST_SUCCESS,
      payload: {
        data: [],
      },
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_CCX_LIST_FAILURE', () => {
    const state = {
      ...initialState,
      status: RequestStatus.ERROR,
      error: '',
    };
    const action = {
      type: FETCH_CCX_LIST_FAILURE,
      payload: '',
    };
    expect(reducer(state, action)).toEqual(state);
  });
});
