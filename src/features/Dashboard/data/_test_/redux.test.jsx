import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchLicensesData, fetchClassesData } from 'features/Dashboard/data';
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
    const licensesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool`
    + '/?limit=false&institution_id=1&page=1&';
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
    const licensesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool/`
    + '?limit=false&institution_id=1';
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

  test('successful fetch classesNoInstructors data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`
    + '?limit=false&institution_id=1&course_name=&instructors=null&page=&';
    const mockResponse = [
      {
        classId: 'ccx-v1:demo+demo1+2020+ccx1',
        className: 'ccx 1',
        masterCourseName: 'Demo Course 1',
        instructors: [],
        numberOfStudents: 0,
        numberOfPendingStudents: 0,
        maxStudents: 20,
        startDate: '2024-01-23T21:50:51Z',
        endDate: null,
      },
    ];
    axiosMock.onGet(classesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().dashboard.classesNoInstructors.status)
      .toEqual('loading');

    await executeThunk(fetchClassesData(1, false), store.dispatch, store.getState);

    expect(store.getState().dashboard.classesNoInstructors.data)
      .toEqual(mockResponse);

    expect(store.getState().dashboard.classesNoInstructors.status)
      .toEqual('success');
  });

  test('failed fetch classesNoInstructors data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`
    + '?limit=false&institution_id=1&course_name=&instructors=null';
    axiosMock.onGet(classesApiUrl)
      .reply(500);

    expect(store.getState().dashboard.classesNoInstructors.status)
      .toEqual('loading');

    await executeThunk(fetchClassesData(1, false), store.dispatch, store.getState);

    expect(store.getState().dashboard.classesNoInstructors.data)
      .toEqual([]);

    expect(store.getState().dashboard.classesNoInstructors.status)
      .toEqual('error');
  });

  test('successful fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`
    + '?limit=false&institution_id=1&course_name=&instructors=&page=&';
    const mockResponse = [
      {
        classId: 'ccx-v1:demo+demo1+2020+ccx1',
        className: 'ccx 1',
        masterCourseName: 'Demo Course 1',
        instructors: [],
        numberOfStudents: 0,
        numberOfPendingStudents: 0,
        maxStudents: 20,
        startDate: '2024-01-23T21:50:51Z',
        endDate: null,
      },
    ];
    axiosMock.onGet(classesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().dashboard.classes.status)
      .toEqual('loading');

    await executeThunk(fetchClassesData(1, true), store.dispatch, store.getState);

    expect(store.getState().dashboard.classes.data)
      .toEqual(mockResponse);

    expect(store.getState().dashboard.classes.status)
      .toEqual('success');
  });

  test('failed fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`
    + '?limit=false&institution_id=1&course_name=&instructors=';
    axiosMock.onGet(classesApiUrl)
      .reply(500);

    expect(store.getState().dashboard.classes.status)
      .toEqual('loading');

    await executeThunk(fetchClassesData(1, true), store.dispatch, store.getState);

    expect(store.getState().dashboard.classes.data)
      .toEqual([]);

    expect(store.getState().dashboard.classes.status)
      .toEqual('error');
  });
});
