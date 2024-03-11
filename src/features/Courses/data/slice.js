/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  table: {
    currentPage: 1,
    data: [],
    status: RequestStatus.LOADING,
    error: null,
    numPages: 0,
    count: 0,
  },
  filters: {},
  selectOptions: [],
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    updateCurrentPage: (state, { payload }) => {
      state.table.currentPage = payload;
    },
    fetchCoursesDataRequest: (state) => {
      state.table.status = RequestStatus.LOADING;
    },
    fetchCoursesDataSuccess: (state, { payload }) => {
      const { results, count, numPages } = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.data = results;
      state.table.numPages = numPages;
      state.table.count = count;
    },
    updateCoursesOptions: (state, { payload }) => {
      state.selectOptions = payload;
    },
    fetchCoursesDataFailed: (state) => {
      state.table.status = RequestStatus.ERROR;
    },
    updateFilters: (state, { payload }) => {
      state.filters = payload;
    },
  },
});

export const {
  updateCurrentPage,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  updateFilters,
  updateCoursesOptions,
} = coursesSlice.actions;

export const { reducer } = coursesSlice;
