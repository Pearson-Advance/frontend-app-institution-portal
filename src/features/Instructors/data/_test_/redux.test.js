import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchInstructorsData, fetchCoursesData, fetchClassesData } from 'features/Instructors/data/thunks';
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

  test('successful fetch courses data', async () => {
    const instructorsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=false&institution_id=1`;
    const mockResponse = [
      {
        masterCourseName: 'Demo Course 1',
        numberOfClasses: 1,
        missingClassesForInstructor: null,
        numberOfStudents: 1,
        numberOfPendingStudents: 11,
      },
    ];
    axiosMock.onGet(instructorsApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().instructors.courses.status)
      .toEqual('loading');

    await executeThunk(fetchCoursesData(1), store.dispatch, store.getState);

    expect(store.getState().instructors.courses.data)
      .toEqual(mockResponse);

    expect(store.getState().instructors.courses.status)
      .toEqual('success');
  });

  test('successful fetch classes data', async () => {
    const instructorsApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/?limit=false`;
    const mockResponse = [
      {
        classUd: 'ccx-v1:demo+demo1+2020+ccx@2',
        className: 'test ccx1',
        masterCourseName: 'Demo Course 1',
      },
    ];
    axiosMock.onGet(instructorsApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().instructors.classes.status)
      .toEqual('loading');

    await executeThunk(fetchClassesData(), store.dispatch, store.getState);

    expect(store.getState().instructors.classes.data)
      .toEqual(mockResponse);

    expect(store.getState().instructors.classes.status)
      .toEqual('success');
  });
});
