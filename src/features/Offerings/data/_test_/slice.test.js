import { reducer, resetOfferingsTable, SEED_OFFERINGS } from 'features/Offerings/data';

describe('offerings slice', () => {
  test('seeds exactly one offering on first load', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state.table.data).toHaveLength(1);
    expect(state.table.data).toEqual(SEED_OFFERINGS);
    expect(state.table.data[0]).toEqual(
      expect.objectContaining({ name: 'Sample Offering', numberOfRuns: 0 }),
    );
  });

  test('resetOfferingsTable restores the seeded state', () => {
    const dirtyState = { table: { data: [], status: 'error', count: 0 } };

    const state = reducer(dirtyState, resetOfferingsTable());

    expect(state.table.data).toEqual(SEED_OFFERINGS);
  });
});
