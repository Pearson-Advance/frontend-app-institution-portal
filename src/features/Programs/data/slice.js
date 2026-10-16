/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

/**
 * Seeded Programs data.
 *
 * Programs are abstract templates (analogous to courses). The backend endpoint
 * is not available yet, so a single seeded Program is shown on first load.
 */
export const SEED_PROGRAMS = [
  {
    id: 1,
    name: 'Sample Program',
    numberOfRuns: 0,
  },
];

const initialState = {
  table: {
    data: SEED_PROGRAMS,
    status: RequestStatus.SUCCESS,
    count: SEED_PROGRAMS.length,
  },
};

export const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    resetProgramsTable: (state) => {
      state.table = initialState.table;
    },
  },
});

export const {
  resetProgramsTable,
} = programsSlice.actions;

export const { reducer } = programsSlice;
