import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchCoursesData, addClass } from 'features/Courses/data/thunks';
import { updateCurrentPage, updateFilters } from 'features/Courses/data/slice';
import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Courses redux tests', () => {
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

  test('successful fetch courses data', async () => {
    const coursesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=true&institution_id=1`;
    const mockResponse = {
      results: [
        {
          masterCourseName: 'Demo Course 1',
          numberOfClasses: 1,
          missingClassesForInstructor: null,
          numberOfStudents: 1,
          numberOfPendingStudents: 11,
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    };

    axiosMock.onGet(coursesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().courses.table.status)
      .toEqual('initial');

    await executeThunk(fetchCoursesData(1), store.dispatch, store.getState);

    expect(store.getState().courses.table.data)
      .toEqual(mockResponse.results);

    expect(store.getState().courses.table.status)
      .toEqual('success');
  });

  test('failed fetch courses data', async () => {
    const coursesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=true&institution_id=1`;
    axiosMock.onGet(coursesApiUrl)
      .reply(500);

    expect(store.getState().courses.table.status)
      .toEqual('initial');

    await executeThunk(fetchCoursesData(1), store.dispatch, store.getState);

    expect(store.getState().courses.table.data)
      .toEqual([]);

    expect(store.getState().courses.table.status)
      .toEqual('error');
  });

  test('update current page', () => {
    const newPage = 2;
    const intialState = store.getState().courses.table;
    const expectState = {
      ...intialState,
      currentPage: newPage,
    };

    store.dispatch(updateCurrentPage(newPage));
    expect(store.getState().courses.table).toEqual(expectState);
  });

  test('update filters', () => {
    const filters = {
      course_name: 'Demo Course 1',
    };
    const intialState = store.getState().courses.filters;
    const expectState = {
      ...intialState,
      ...filters,
    };

    store.dispatch(updateFilters(filters));
    expect(store.getState().courses.filters).toEqual(expectState);
  });

  test('successful add class', async () => {
    const classApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    const dataCreateClass = new FormData();
    const instructorData = new FormData();
    const classId = 'ccx1';
    const mockResponse = {
      class_id: classId,
    };
    axiosMock.onPost(classApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().courses.newClass.status)
      .toEqual('loading');

    await executeThunk(addClass(dataCreateClass, instructorData), store.dispatch, store.getState);

    expect(store.getState().courses.newClass.data)
      .toEqual(mockResponse);

    expect(store.getState().courses.newClass.status)
      .toEqual('success');
  });

  test('failed add class', async () => {
    const classApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    const dataCreateClass = new FormData();
    const instructorData = new FormData();

    axiosMock.onPost(classApiUrl)
      .reply(500);

    expect(store.getState().courses.newClass.status)
      .toEqual('loading');

    await executeThunk(addClass(dataCreateClass, instructorData), store.dispatch, store.getState);

    expect(store.getState().courses.newClass.data)
      .toEqual(null);

    expect(store.getState().courses.newClass.status)
      .toEqual('error');
  });
});
