import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import {
  fetchStudentsData,
  fetchClassesMetricsData,
  fetchStudentsMetricsData,
} from 'features/Students/data/thunks';
import { updateCurrentPage, updateFilters } from 'features/Students/data/slice';
import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Students redux tests', () => {
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

  test('successful fetch students data', async () => {
    const studentsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/students/`;
    const mockResponse = {
      results: [
        {
          learnerName: 'pending_enrollment',
          learnerEmail: 'student04@example.com',
          instructors: [
            'Instructor01',
          ],
          courseName: 'Demo Course 1',
          classId: 'ccx-v1:demo+demo1+2020+ccx@2',
          className: 'test ccx1',
          status: 'Pending',
          examReady: false,
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    };
    axiosMock.onGet(studentsApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().students.table.status)
      .toEqual('loading');

    await executeThunk(fetchStudentsData(), store.dispatch, store.getState);

    expect(store.getState().students.table.data)
      .toEqual(mockResponse.results);

    expect(store.getState().students.table.status)
      .toEqual('success');
  });

  test('failed fetch students data', async () => {
    const studentsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/students/`;
    axiosMock.onGet(studentsApiUrl)
      .reply(500);

    expect(store.getState().students.table.status)
      .toEqual('loading');

    await executeThunk(fetchStudentsData(), store.dispatch, store.getState);

    expect(store.getState().students.table.data)
      .toEqual([]);

    expect(store.getState().students.table.status)
      .toEqual('error');
  });

  test('successful fetch classes metrics data', async () => {
    const classesMetricsApiUrl = `${process.env.COURSE_OPERATIONS_API_METRICS_BASE_URL}/classes-number/`;
    const mockResponse = { numberOfClassesCreated: 71 };
    axiosMock.onGet(classesMetricsApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().students.classesMetrics.status)
      .toEqual('loading');

    await executeThunk(fetchClassesMetricsData(1, 2), store.dispatch, store.getState);

    expect(store.getState().students.classesMetrics.data)
      .toEqual(mockResponse);

    expect(store.getState().students.classesMetrics.status)
      .toEqual('success');
  });

  test('failed fetch classes metrics data', async () => {
    const classesMetricsApiUrl = `${process.env.COURSE_OPERATIONS_API_METRICS_BASE_URL}/classes-number/`;

    axiosMock.onGet(classesMetricsApiUrl)
      .reply(500);

    expect(store.getState().students.classesMetrics.status)
      .toEqual('loading');

    await executeThunk(fetchClassesMetricsData(1, 2), store.dispatch, store.getState);

    expect(store.getState().students.classesMetrics.data)
      .toEqual([]);

    expect(store.getState().students.classesMetrics.status)
      .toEqual('error');
  });

  test('successful fetch students metrics data', async () => {
    const studentsMetricsApiUrl = `${process.env.COURSE_OPERATIONS_API_METRICS_BASE_URL}/students-number/`;
    const mockResponse = { numberOfEnrollments: 20 };
    axiosMock.onGet(studentsMetricsApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().students.studentsMetrics.status)
      .toEqual('loading');

    await executeThunk(fetchStudentsMetricsData(1, 2), store.dispatch, store.getState);

    expect(store.getState().students.studentsMetrics.data)
      .toEqual(mockResponse);

    expect(store.getState().students.studentsMetrics.status)
      .toEqual('success');
  });

  test('failed fetch students metrics data', async () => {
    const studentsMetricsApiUrl = `${process.env.COURSE_OPERATIONS_API_METRICS_BASE_URL}/students-number/`;

    axiosMock.onGet(studentsMetricsApiUrl)
      .reply(500);

    expect(store.getState().students.studentsMetrics.status)
      .toEqual('loading');

    await executeThunk(fetchStudentsMetricsData(1, 2), store.dispatch, store.getState);

    expect(store.getState().students.studentsMetrics.data)
      .toEqual([]);

    expect(store.getState().students.studentsMetrics.status)
      .toEqual('error');
  });

  test('update current page', () => {
    const newPage = 2;
    const intialState = store.getState().students.table;
    const expectState = {
      ...intialState,
      currentPage: newPage,
    };

    store.dispatch(updateCurrentPage(newPage));
    expect(store.getState().students.table).toEqual(expectState);
  });

  test('update current page', () => {
    const newPage = 2;
    const intialState = store.getState().students.table;
    const expectState = {
      ...intialState,
      currentPage: newPage,
    };

    store.dispatch(updateCurrentPage(newPage));
    expect(store.getState().students.table).toEqual(expectState);
  });

  test('update filters', () => {
    const filters = {
      course_name: 'Demo Course 1',
    };
    const intialState = store.getState().students.filters;
    const expectState = {
      ...intialState,
      ...filters,
    };

    store.dispatch(updateFilters(filters));
    expect(store.getState().students.filters).toEqual(expectState);
  });
});
