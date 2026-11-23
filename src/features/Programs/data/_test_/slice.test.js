import {
  reducer,
  resetProgramsTable,
  updateCurrentPage,
  updateFilters,
} from 'features/Programs/data/slice';
import { initialPage } from 'features/constants';

describe('programs slice', () => {
  test('initializes with default currentPage', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      currentPage: initialPage,
      filters: {},
    });
  });

  test('updateCurrentPage updates the active page', () => {
    const state = reducer(undefined, updateCurrentPage(3));

    expect(state.currentPage).toBe(3);
  });

  test('updateFilters stores the applied filters', () => {
    const state = reducer(undefined, updateFilters({ name: 'cloud' }));

    expect(state.filters).toEqual({ name: 'cloud' });
  });

  test('resetProgramsTable restores the initial page and filters', () => {
    const dirtyState = { currentPage: 4, filters: { name: 'cloud' } };

    const state = reducer(dirtyState, resetProgramsTable());

    expect(state).toEqual({ currentPage: initialPage, filters: {} });
  });
});
