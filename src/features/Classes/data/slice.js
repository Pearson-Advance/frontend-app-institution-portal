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
};

export const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    updateCurrentPage: (state, { payload }) => {
      state.table.currentPage = payload;
    },
    fetchClassesDataRequest: (state) => {
      state.table.status = RequestStatus.LOADING;
    },
    fetchClassesDataSuccess: (state, { payload }) => {
      const { results, count, numPages } = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.data = results;
      state.table.numPages = numPages;
      state.table.count = count;
    },
    fetchClassesDataFailed: (state) => {
      state.table.status = RequestStatus.ERROR;
    },
  },
});

export const {
  updateCurrentPage,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
} = classesSlice.actions;

export const { reducer } = classesSlice;
