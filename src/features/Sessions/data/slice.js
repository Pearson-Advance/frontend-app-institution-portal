/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, initialPage } from 'features/constants';

const initialState = {
  currentPage: initialPage,
  filters: {
    hidden: false,
  },
  table: {
    data: [],
    status: RequestStatus.SUCCESS,
    count: 0,
  },
};

export const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetSessionsTable: (state) => {
      state.table = initialState.table;
      state.currentPage = initialPage;
      state.filters = initialState.filters;
    },
  },
});

export const {
  resetSessionsTable,
  updateCurrentPage,
  updateFilters,
} = sessionsSlice.actions;

export const { reducer } = sessionsSlice;
