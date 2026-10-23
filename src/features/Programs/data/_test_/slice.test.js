import { reducer, resetProgramsTable, SEED_PROGRAMS } from 'features/Programs/data';

describe('programs slice', () => {
  test('seeds programs with program, courses and enrollment data on first load', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state.table.data).toEqual(SEED_PROGRAMS);
    expect(state.table.count).toBe(SEED_PROGRAMS.length);
    expect(state.table.data[0]).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        numberOfCourses: expect.any(Number),
        numberOfRuns: expect.any(Number),
        studentsEnrolled: expect.any(Number),
        courses: expect.any(Array),
      }),
    );
    expect(state.table.data[0].courses[0]).toEqual(
      expect.objectContaining({
        sequence: expect.any(Number),
        name: expect.any(String),
      }),
    );
  });

  test('resetProgramsTable restores the seeded state', () => {
    const dirtyState = { table: { data: [], status: 'error', count: 0 } };

    const state = reducer(dirtyState, resetProgramsTable());

    expect(state.table.data).toEqual(SEED_PROGRAMS);
  });
});
