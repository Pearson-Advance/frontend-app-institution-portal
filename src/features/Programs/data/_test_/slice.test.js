import {
  reducer,
  resetProgramsTable,
  updateCurrentPage,
} from 'features/Programs/data/slice';
import { initialPage } from 'features/constants';

describe('programs slice', () => {
  test('initializes with default currentPage', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      currentPage: initialPage,
    });
  });

  test('updateCurrentPage updates the active page', () => {
    const state = reducer(undefined, updateCurrentPage(3));

    expect(state.currentPage).toBe(3);
  });

  test('resetProgramsTable restores the initial page', () => {
    const dirtyState = { currentPage: 4 };

    const state = reducer(dirtyState, resetProgramsTable());

    expect(state.currentPage).toBe(initialPage);
  });
});
