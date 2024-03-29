import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import {
  fetchInstructorsData, addInstructor,
} from 'features/Instructors/data/thunks';
import {
  updateCurrentPage,
  updateFilters,
  updateClassSelected,
  addRowSelect,
  deleteRowSelect,
  resetRowSelect,
} from 'features/Instructors/data/slice';
import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Instructors redux tests', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 1,
        username: 'testuser',
        administrator: true,
        roles: [],
      },
    });
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());

    store = initializeStore();
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test('successful fetch instructors data', async () => {
    const instructorsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/`;
    const mockResponse = {
      results: [
        {
          instructorUsername: 'Instructor1',
          instructorName: 'Instructor 1',
          instructorEmail: 'instructor1@example.com',
          ccxId: 'CCX1',
          ccxName: 'CCX 1',
        },
        {
          instructorUsername: 'Instructor2',
          instructorName: 'Instructor 2',
          instructorEmail: 'instructor2@example.com',
          ccxId: 'CCX2',
          ccxName: 'CCX 2',
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    };
    axiosMock.onGet(instructorsApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().instructors.table.status)
      .toEqual('loading');

    await executeThunk(fetchInstructorsData(), store.dispatch, store.getState);

    expect(store.getState().instructors.table.data)
      .toEqual(mockResponse.results);

    expect(store.getState().instructors.table.status)
      .toEqual('success');
  });

  test('failed fetch instructors data', async () => {
    const instructorsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/`;
    axiosMock.onGet(instructorsApiUrl)
      .reply(500);

    expect(store.getState().instructors.table.status)
      .toEqual('loading');

    await executeThunk(fetchInstructorsData(), store.dispatch, store.getState);

    expect(store.getState().instructors.table.data)
      .toEqual([]);

    expect(store.getState().instructors.table.status)
      .toEqual('error');
  });

  test('update current page', () => {
    const newPage = 2;
    const intialState = store.getState().instructors.table;
    const expectState = {
      ...intialState,
      currentPage: newPage,
    };

    store.dispatch(updateCurrentPage(newPage));
    expect(store.getState().instructors.table).toEqual(expectState);
  });

  test('update filters', () => {
    const filters = {
      course_name: 'Demo Course 1',
    };
    const intialState = store.getState().instructors.filters;
    const expectState = {
      ...intialState,
      ...filters,
    };

    store.dispatch(updateFilters(filters));
    expect(store.getState().instructors.filters).toEqual(expectState);
  });

  test('update classSelected', () => {
    const classSelected = 'ccx1';
    const expectState = classSelected;

    store.dispatch(updateClassSelected(classSelected));
    expect(store.getState().instructors.classSelected).toEqual(expectState);
  });

  test('Add rowsSelected', () => {
    const rowSelected = 'Instructor01';
    const expectState = rowSelected;

    store.dispatch(addRowSelect(rowSelected));
    expect(store.getState().instructors.rowsSelected).toEqual([expectState]);
  });

  test('Delete rowsSelected', () => {
    const rowSelected = 'Instructor01';

    store.dispatch(addRowSelect(rowSelected));
    store.dispatch(deleteRowSelect(rowSelected));
    expect(store.getState().instructors.rowsSelected).toEqual([]);
  });

  test('successful add instructor', async () => {
    const instructorsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/?instructor_email=testEmail@example.com&institution_id=1`;
    const institutionId = '1';
    const instructorEmail = 'testEmail@example.com';
    const mockResponse = {
      instructor_email: instructorEmail,
      institution_id: institutionId,
    };
    axiosMock.onPost(instructorsApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().instructors.addInstructor.status)
      .toEqual('loading');

    await executeThunk(addInstructor(institutionId, instructorEmail), store.dispatch, store.getState);

    expect(store.getState().instructors.addInstructor.data)
      .toEqual(mockResponse);

    expect(store.getState().instructors.addInstructor.status)
      .toEqual('success');
  });

  test('failed add instructor', async () => {
    const instructorsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/?instructor_email=testEmail@example.com&institution_id=1`;
    const institutionId = '1';
    const instructorEmail = 'testEmail@example.com';

    axiosMock.onPost(instructorsApiUrl)
      .reply(500);

    expect(store.getState().instructors.addInstructor.status)
      .toEqual('loading');

    await executeThunk(addInstructor(institutionId, instructorEmail), store.dispatch, store.getState);

    expect(store.getState().instructors.addInstructor.data)
      .toEqual(null);

    expect(store.getState().instructors.addInstructor.status)
      .toEqual('error');
  });

  test('Reset rowsSelected', () => {
    const expectState = [];

    store.dispatch(resetRowSelect());
    expect(store.getState().instructors.rowsSelected).toEqual(expectState);
  });
});
