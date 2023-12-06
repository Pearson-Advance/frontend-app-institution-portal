import {
  FETCH_COURSES_DATA_FAILURE,
  FETCH_COURSES_DATA_REQUEST,
  FETCH_COURSES_DATA_SUCCESS,
} from 'features/Instructors/actionTypes';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Students/StudentsFilters/reducer';

describe('Student filter reducers', () => {
  const initialState = {
    courses: {
      data: [],
      status: RequestStatus.SUCCESS,
      error: null,
    },
  };

  test('should handle FETCH_COURSES_DATA_REQUEST', () => {
    const state = {
      ...initialState,
      courses: {
        ...initialState.courses,
        status: RequestStatus.LOADING,
      },
    };
    const action = {
      type: FETCH_COURSES_DATA_REQUEST,
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_COURSES_DATA_SUCCESS', () => {
    const state = {
      ...initialState,
      courses: {
        ...initialState.courses,
        status: RequestStatus.SUCCESS,
        data: [],
      },
    };
    const action = {
      type: FETCH_COURSES_DATA_SUCCESS,
      payload: [],
    };
    expect(reducer(state, action)).toEqual(state);
  });

  test('should handle FETCH_COURSES_DATA_FAILURE', () => {
    const state = {
      ...initialState,
      courses: {
        ...initialState.courses,
        status: RequestStatus.ERROR,
        error: '',
      },
    };
    const action = {
      type: FETCH_COURSES_DATA_FAILURE,
      payload: '',
    };
    expect(reducer(state, action)).toEqual(state);
  });
});
