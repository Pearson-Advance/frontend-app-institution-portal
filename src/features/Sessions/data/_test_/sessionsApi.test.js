import { configureStore } from '@reduxjs/toolkit';
import { sessionsApi } from 'features/Sessions/data/sessionsApi';
import { studentsApi } from 'features/Students/data/studentsApi';
import { enrollStudentToSession } from 'features/Sessions/data/api';

jest.mock('features/Sessions/data/api', () => ({
  ...jest.requireActual('features/Sessions/data/api'),
  enrollStudentToSession: jest.fn(),
}));

const setupStore = () => {
  const actions = [];
  const recordActions = () => (next) => (action) => {
    actions.push(action);
    return next(action);
  };

  const store = configureStore({
    reducer: {
      [sessionsApi.reducerPath]: sessionsApi.reducer,
      [studentsApi.reducerPath]: studentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
      recordActions,
      sessionsApi.middleware,
      studentsApi.middleware,
    ),
  });

  const studentsClassInvalidations = () => actions.filter(
    (action) => studentsApi.util.invalidateTags.match(action)
      && action.payload.includes('StudentsClass'),
  );

  return { store, studentsClassInvalidations };
};

describe('sessionsApi enrollStudentInSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('invalidates StudentsClass after a successful enrollment', async () => {
    enrollStudentToSession.mockResolvedValue({
      data: { results: [{ identifier: 'a@example.com', status: 'completed' }] },
    });
    const { store, studentsClassInvalidations } = setupStore();

    const result = await store.dispatch(
      sessionsApi.endpoints.enrollStudentInSession.initiate({
        offeringRunId: 'run-1',
        data: { identifiers: 'a@example.com' },
      }),
    );

    expect(result.data.results).toHaveLength(1);
    expect(enrollStudentToSession).toHaveBeenCalledWith('run-1', { identifiers: 'a@example.com' });
    expect(studentsClassInvalidations()).toHaveLength(1);
  });

  test('does not invalidate StudentsClass when the enrollment fails', async () => {
    enrollStudentToSession.mockRejectedValue({
      message: 'Request failed',
      response: { status: 400, data: { detail: 'Nope' } },
    });
    const { store, studentsClassInvalidations } = setupStore();

    const result = await store.dispatch(
      sessionsApi.endpoints.enrollStudentInSession.initiate({
        offeringRunId: 'run-1',
        data: { identifiers: 'a@example.com' },
      }),
    );

    expect(result.error).toEqual({
      status: 400,
      data: { detail: 'Nope' },
      message: 'Request failed',
    });
    expect(studentsClassInvalidations()).toHaveLength(0);
  });
});
