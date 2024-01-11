import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchLicensesData } from 'features/Dashboard/data';
import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Dashboard redux tests', () => {
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
    const licensesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool/?limit=false&institution_id=1`;
    const mockResponse = [
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
    ];
    axiosMock.onGet(licensesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().dashboard.tableLicense.status)
      .toEqual('loading');

    await executeThunk(fetchLicensesData(1), store.dispatch, store.getState);

    expect(store.getState().dashboard.tableLicense.data)
      .toEqual(mockResponse);

    expect(store.getState().dashboard.tableLicense.status)
      .toEqual('success');
  });

  test('failed fetch licenses data', async () => {
    const licensesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool/?limit=false&institution_id=1`;
    axiosMock.onGet(licensesApiUrl)
      .reply(500);

    expect(store.getState().dashboard.tableLicense.status)
      .toEqual('loading');

    await executeThunk(fetchLicensesData(1), store.dispatch, store.getState);

    expect(store.getState().dashboard.tableLicense.data)
      .toEqual([]);

    expect(store.getState().dashboard.tableLicense.status)
      .toEqual('error');
  });
});
