import {
  FETCH_STUDENTS_DATA_REQUEST,
  FETCH_STUDENTS_DATA_SUCCESS,
  FETCH_STUDENTS_DATA_FAILURE,
  UPDATE_CURRENT_PAGE,
} from 'features/Students/actionTypes';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Instructors/InstructorsPage/reducer';

describe('Instructor page reducers', () => {
  const initialState = {
    data: [],
    error: null,
    currentPage: 1,
    numPages: 0,
  };

  test('should handle FETCH_STUDENTS_DATA_REQUEST', () => {
    const state = {
      ...initialState,
      status: RequestStatus.LOADING,
    };
    const action = {
      type: FETCH_STUDENTS_DATA_REQUEST,
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_STUDENTS_DATA_SUCCESS', () => {
    const state = {
      ...initialState,
      status: RequestStatus.SUCCESS,
      count: 0,
    };
    const action = {
      type: FETCH_STUDENTS_DATA_SUCCESS,
      payload: {
        results: [],
        count: 0,
        numPages: 0,
      },
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_STUDENTS_DATA_FAILURE', () => {
    const state = {
      ...initialState,
      status: RequestStatus.ERROR,
      error: '',
    };
    const action = {
      type: FETCH_STUDENTS_DATA_FAILURE,
      payload: '',
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle UPDATE_CURRENT_PAGE', () => {
    const state = {
      ...initialState,
      currentPage: 1,
    };
    const action = {
      type: UPDATE_CURRENT_PAGE,
      payload: 1,
    };
    expect(reducer(state, action)).toEqual(state);
  });
});
