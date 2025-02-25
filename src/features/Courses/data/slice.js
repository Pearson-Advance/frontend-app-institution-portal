/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  table: {
    currentPage: 1,
    data: [],
    status: RequestStatus.INITIAL,
    error: null,
    numPages: 0,
    count: 0,
  },
  filters: {},
  selectOptions: [],
  newClass: {
    status: RequestStatus.LOADING,
    error: null,
    data: null,
  },
  notificationMessage: '',
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    resetCoursesTable: (state) => {
      state.table = initialState.table;
    },
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
    resetClassState: (state) => {
      state.newClass.status = RequestStatus.INITIAL;
      state.notificationMessage = null;
    },
    newClassRequest: (state) => {
      state.newClass.status = RequestStatus.LOADING;
    },
    newClassSuccess: (state, { payload }) => {
      state.newClass.status = RequestStatus.SUCCESS;
      state.newClass.data = payload;
    },
    newClassFailed: (state) => {
      state.newClass.status = RequestStatus.ERROR;
    },
    updateNotificationMsg: (state, { payload }) => {
      state.notificationMessage = payload;
    },
  },
});

export const {
  resetCoursesTable,
  updateCurrentPage,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  updateFilters,
  updateCoursesOptions,
  newClassRequest,
  newClassSuccess,
  newClassFailed,
  resetClassState,
  updateNotificationMsg,
} = coursesSlice.actions;

export const { reducer } = coursesSlice;
