/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, initialStateService } from 'features/constants';

const initialState = {
  table: {
    currentPage: 1,
    data: [],
    status: RequestStatus.LOADING,
    error: null,
    numPages: 0,
    count: 0,
  },
  courses: {
    ...initialStateService,
  },
  classes: {
    ...initialStateService,
  },
  metrics: {
    ...initialStateService,
  },
  filters: {},
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    updateCurrentPage: (state, { payload }) => {
      state.table.currentPage = payload;
    },
    fetchStudentsDataRequest: (state) => {
      state.table.status = RequestStatus.LOADING;
    },
    fetchStudentsDataSuccess: (state, { payload }) => {
      const { results, count, numPages } = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.data = results;
      state.table.numPages = numPages;
      state.table.count = count;
    },
    fetchStudentsDataFailed: (state) => {
      state.table.status = RequestStatus.ERROR;
    },
    updateFilters: (state, { payload }) => {
      state.filters = payload;
    },
    fetchCoursesDataRequest: (state) => {
      state.courses.status = RequestStatus.LOADING;
    },
    fetchCoursesDataSuccess: (state, { payload }) => {
      state.courses.status = RequestStatus.SUCCESS;
      state.courses.data = payload;
    },
    fetchCoursesDataFailed: (state) => {
      state.courses.status = RequestStatus.ERROR;
    },
    fetchClassesDataRequest: (state) => {
      state.classes.status = RequestStatus.LOADING;
    },
    fetchClassesDataSuccess: (state, { payload }) => {
      state.classes.status = RequestStatus.SUCCESS;
      state.classes.data = payload;
    },
    fetchClassesDataFailed: (state) => {
      state.classes.status = RequestStatus.ERROR;
    },
    fetchMetricsDataRequest: (state) => {
      state.metrics.status = RequestStatus.LOADING;
    },
    fetchMetricsDataSuccess: (state, { payload }) => {
      state.metrics.status = RequestStatus.SUCCESS;
      state.metrics.data = payload;
    },
    fetchMetricsDataFailed: (state) => {
      state.metrics.status = RequestStatus.ERROR;
    },
  },
});

export const {
  updateCurrentPage,
  fetchStudentsDataRequest,
  fetchStudentsDataSuccess,
  fetchStudentsDataFailed,
  updateFilters,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  fetchMetricsDataRequest,
  fetchMetricsDataSuccess,
  fetchMetricsDataFailed,
} = studentsSlice.actions;

export const { reducer } = studentsSlice;
