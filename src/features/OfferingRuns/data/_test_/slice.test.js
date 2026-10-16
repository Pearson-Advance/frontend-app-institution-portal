import { reducer } from 'features/OfferingRuns/data';

describe('offeringRuns slice', () => {
  test('starts with an empty table by default', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state.table.data).toEqual([]);
    expect(state.table.count).toBe(0);
  });
});
