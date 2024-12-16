import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchLicensesData } from 'features/Licenses/data';
import { updateCurrentPage, updateFilters } from 'features/Licenses/data/slice';
import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Licenses redux tests', () => {
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

  test('successful fetch licenses data', async () => {
    const licensesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool`
    + '/?limit=true&institution_id=1';
    const mockResponse = {
      results: [
        {
          licenseName: 'License Name 1',
          purchasedSeats: 20,
          numberOfStudents: 6,
          numberOfPendingStudents: 11,
        },
        {
          licenseName: 'License Name 2',
          purchasedSeats: 10,
          numberOfStudents: 1,
          numberOfPendingStudents: 5,
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    };
    axiosMock.onGet(licensesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().licenses.table.status)
      .toEqual('initial');

    await executeThunk(fetchLicensesData(1), store.dispatch, store.getState);

    expect(store.getState().licenses.table.data)
      .toEqual(mockResponse.results);

    expect(store.getState().licenses.table.status)
      .toEqual('success');
  });

  test('failed fetch licenses data', async () => {
    const licensesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool`
    + '/?limit=false&institution_id=1';
    axiosMock.onGet(licensesApiUrl)
      .reply(500);

    expect(store.getState().licenses.table.status)
      .toEqual('initial');

    await executeThunk(fetchLicensesData(1), store.dispatch, store.getState);

    expect(store.getState().licenses.table.data)
      .toEqual([]);

    expect(store.getState().licenses.table.status)
      .toEqual('error');
  });

  test('update current page', () => {
    const newPage = 2;
    const initialState = store.getState().courses.table;
    const expectState = {
      ...initialState,
      currentPage: newPage,
    };

    store.dispatch(updateCurrentPage(newPage));
    expect(store.getState().licenses.table).toEqual(expectState);
  });

  test('update filters', () => {
    const filters = {
      course_name: 'Demo Course 1',
    };
    const initialState = store.getState().licenses.filters;
    const expectState = {
      ...initialState,
      ...filters,
    };

    store.dispatch(updateFilters(filters));
    expect(store.getState().licenses.filters).toEqual(expectState);
  });
});
