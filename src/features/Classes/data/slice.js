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
  allClasses: {
    data: [],
    count: 0,
  },
};

export const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    resetClassesTable: (state) => {
      state.table = initialState.table;
    },
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
    updateFilters: (state, { payload }) => {
      state.filters = payload;
    },
    updateClassesOptions: (state, { payload }) => {
      state.selectOptions = payload;
    },
    fillClassesTable: (state, { payload }) => {
      state.table.data = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.numPages = 1;
      state.table.count = payload?.length;
    },
    updateAllClasses: (state, { payload }) => {
      state.allClasses.data = payload;
      state.allClasses.count = payload?.length;
    },
    resetClasses: (state) => {
      state.allClasses = initialState.allClasses;
    },
  },
});

export const {
  updateCurrentPage,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  updateFilters,
  updateClassesOptions,
  fillClassesTable,
  updateAllClasses,
  resetClasses,
  resetClassesTable,
} = classesSlice.actions;

export const { reducer } = classesSlice;
