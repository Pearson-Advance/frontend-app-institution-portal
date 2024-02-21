import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchClassesData } from 'features/Classes/data/thunks';
import { updateCurrentPage } from 'features/Classes/data/slice';
import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Classes redux tests', () => {
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

  test('successful fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/?limit=true&institution_id=1&course_name=&instructors=&page=1`;
    const mockResponse = {
      results: [
        {
          masterCourseName: 'Demo MasterCourse 1',
          className: 'Demo Class 1',
          startDate: '09/21/24',
          endDate: null,
          numberOfStudents: 1,
          maxStudents: 100,
          instructors: ['instructor_1'],
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    };
    axiosMock.onGet(classesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().classes.table.status)
      .toEqual('loading');

    await executeThunk(fetchClassesData(1, 1), store.dispatch, store.getState);

    expect(store.getState().classes.table.data)
      .toEqual(mockResponse.results);

    expect(store.getState().classes.table.status)
      .toEqual('success');
  });

  test('failed fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/?limit=true&institution_id=1&course_name=&instructors=&page=1`;
    axiosMock.onGet(classesApiUrl)
      .reply(500);

    expect(store.getState().classes.table.status)
      .toEqual('loading');

    await executeThunk(fetchClassesData(1, 1), store.dispatch, store.getState);

    expect(store.getState().classes.table.data)
      .toEqual([]);

    expect(store.getState().classes.table.status)
      .toEqual('error');
  });

  test('update current page', () => {
    const newPage = 2;
    const intialState = store.getState().classes.table;
    const expectState = {
      ...intialState,
      currentPage: newPage,
    };

    store.dispatch(updateCurrentPage(newPage));
    expect(store.getState().classes.table).toEqual(expectState);
  });
});
