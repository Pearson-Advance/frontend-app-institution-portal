/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, initialStateService } from 'features/constants';

const initialState = {
  table: {
    currentPage: 1,
    data: [],
    status: RequestStatus.INITIAL,
    error: null,
    numPages: 0,
    count: 0,
  },
  classesMetrics: {
    ...initialStateService,
  },
  studentsMetrics: {
    ...initialStateService,
  },
  filters: {},
  studentProfile: {},
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
      state.table.numPages = numPages || state.table.numPages;
      state.table.count = count;
    },
    fetchStudentsDataFailed: (state) => {
      state.table.status = RequestStatus.ERROR;
    },
    updateFilters: (state, { payload }) => {
      state.filters = payload;
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
    updateStudentProfile: (state, { payload }) => {
      state.studentProfile = payload;
    },
    updateStudentProfileStatus: (state, { payload }) => {
      state.studentProfile.status = payload;
    },
    resetStudentProfile: (state) => {
      state.studentProfile = initialState.studentProfile;
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
  fetchClassesMetricsDataRequest,
  fetchClassesMetricsDataSuccess,
  fetchClassesMetricsDataFailed,
  fetchStudentsMetricsDataRequest,
  fetchStudentsMetricsDataSuccess,
  fetchStudentsMetricsDataFailed,
  updateStudentProfile,
  resetStudentProfile,
  updateStudentProfileStatus,
} = studentsSlice.actions;

export const { reducer } = studentsSlice;
