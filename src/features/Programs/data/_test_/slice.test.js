import { reducer, resetProgramsTable, SEED_PROGRAMS } from 'features/Programs/data';

describe('programs slice', () => {
  test('seeds exactly one program on first load', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state.table.data).toHaveLength(1);
    expect(state.table.data).toEqual(SEED_PROGRAMS);
    expect(state.table.data[0]).toEqual(
      expect.objectContaining({ name: 'Sample Program', numberOfRuns: 0 }),
    );
  });

  test('resetProgramsTable restores the seeded state', () => {
    const dirtyState = { table: { data: [], status: 'error', count: 0 } };

    const state = reducer(dirtyState, resetProgramsTable());

    expect(state.table.data).toEqual(SEED_PROGRAMS);
  });
});
