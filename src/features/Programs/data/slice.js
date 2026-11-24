/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialPage } from 'features/constants';

const initialState = {
  currentPage: initialPage,
  filters: {},
};

export const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetProgramsTable: (state) => {
      state.currentPage = initialPage;
      state.filters = initialState.filters;
    },
  },
});

export const {
  resetProgramsTable,
  updateCurrentPage,
  updateFilters,
} = programsSlice.actions;

export const { reducer } = programsSlice;
