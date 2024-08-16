import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchClassesData, fetchAllClassesData } from 'features/Classes/data/thunks';
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
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/?course_id=`;
    const mockResponse = {
      results: [
        {
          masterCourseName: 'Demo MasterCourse 1',
          masterCourseId: 'course-v1:XXX+YYY+2023',
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
      .toEqual('initial');

    await executeThunk(fetchClassesData(1, 1), store.dispatch, store.getState);

    expect(store.getState().classes.table.data)
      .toEqual(mockResponse.results);

    expect(store.getState().classes.table.status)
      .toEqual('success');
  });

  test('failed fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    axiosMock.onGet(classesApiUrl)
      .reply(500);

    expect(store.getState().classes.table.status)
      .toEqual('initial');

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

  test('successful fetch all classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/?course_id=`;
    const mockResponse = [
      {
        masterCourseName: 'Demo MasterCourse 1',
        masterCourseId: 'course-v1:XXX+YYY+2023',
        className: 'Demo Class 1',
        startDate: '09/21/24',
        endDate: null,
        numberOfStudents: 1,
        maxStudents: 100,
        instructors: ['instructor_1'],
      },
    ];
    axiosMock.onGet(classesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().classes.allClasses.status)
      .toEqual('initial');

    await executeThunk(fetchAllClassesData(1), store.dispatch, store.getState);

    expect(store.getState().classes.allClasses.data)
      .toEqual(mockResponse);

    expect(store.getState().classes.allClasses.status)
      .toEqual('success');
  });

  test('failed fetch all classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    axiosMock.onGet(classesApiUrl)
      .reply(500);

    expect(store.getState().classes.allClasses.status)
      .toEqual('initial');

    await executeThunk(fetchAllClassesData(1), store.dispatch, store.getState);

    expect(store.getState().classes.allClasses.data)
      .toEqual([]);

    expect(store.getState().classes.allClasses.status)
      .toEqual('error');
  });
});
