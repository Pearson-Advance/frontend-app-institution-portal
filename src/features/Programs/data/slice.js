/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialPage } from 'features/constants';

const initialState = {
  currentPage: initialPage,
};

export const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetProgramsTable: (state) => {
      state.currentPage = initialPage;
    },
  },
});

export const {
  resetProgramsTable,
  updateCurrentPage,
} = programsSlice.actions;

export const { reducer } = programsSlice;
