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
  classesMetrics: {
    ...initialStateService,
  },
  studentsMetrics: {
    ...initialStateService,
  },
  filters: {},
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    resetStudentsTable: (state) => {
      state.table = initialState.table;
    },
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
    fetchClassesMetricsDataRequest: (state) => {
      state.classesMetrics.status = RequestStatus.LOADING;
    },
    fetchClassesMetricsDataSuccess: (state, { payload }) => {
      state.classesMetrics.status = RequestStatus.SUCCESS;
      state.classesMetrics.data = payload;
    },
    fetchClassesMetricsDataFailed: (state) => {
      state.classesMetrics.status = RequestStatus.ERROR;
    },
    fetchStudentsMetricsDataRequest: (state) => {
      state.studentsMetrics.status = RequestStatus.LOADING;
    },
    fetchStudentsMetricsDataSuccess: (state, { payload }) => {
      state.studentsMetrics.status = RequestStatus.SUCCESS;
      state.studentsMetrics.data = payload;
    },
    fetchStudentsMetricsDataFailed: (state) => {
      state.studentsMetrics.status = RequestStatus.ERROR;
    },
  },
});

export const {
  updateCurrentPage,
  fetchStudentsDataRequest,
  fetchStudentsDataSuccess,
  fetchStudentsDataFailed,
  updateFilters,
  resetStudentsTable,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  fetchClassesMetricsDataRequest,
  fetchClassesMetricsDataSuccess,
  fetchClassesMetricsDataFailed,
  fetchStudentsMetricsDataRequest,
  fetchStudentsMetricsDataSuccess,
  fetchStudentsMetricsDataFailed,
} = studentsSlice.actions;

export const { reducer } = studentsSlice;
