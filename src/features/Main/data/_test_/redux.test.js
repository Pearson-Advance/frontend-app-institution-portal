import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateActiveTab } from 'features/Main/data/slice';
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
    const institutionApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/institutions/?limit=false`;
    const mockResponse = [
      {
        id: 1,
        name: 'Institution1',
        shortName: 'Inst1',
        active: true,
      },
    ];
    axiosMock.onGet(institutionApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().main.institution.status)
      .toEqual('loading');

    await executeThunk(fetchInstitutionData(), store.dispatch, store.getState);

    expect(store.getState().main.institution.data)
      .toEqual(mockResponse);

    expect(store.getState().main.institution.status)
      .toEqual('success');
  });

  test('update active tab', () => {
    const newActiveTab = 'courses';

    store.dispatch(updateActiveTab(newActiveTab));
    expect(store.getState().main.activeTab).toEqual(newActiveTab);
  });
});
