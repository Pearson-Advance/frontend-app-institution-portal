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
  courses: {
    data: [],
    status: RequestStatus.LOADING,
    error: null,
  },
  classes: {
    data: [],
    status: RequestStatus.LOADING,
  },
  filters: {
  },
};

export const instructorsSlice = createSlice({
  name: 'instructors',
  initialState,
  reducers: {
    updateCurrentPage: (state, { payload }) => {
      state.table.currentPage = payload;
    },
    fetchInstructorsDataRequest: (state) => {
      state.table.status = RequestStatus.LOADING;
    },
    fetchInstructorsDataSuccess: (state, { payload }) => {
      const { results, count, numPages } = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.data = results;
      state.table.numPages = numPages;
      state.table.count = count;
    },
    fetchInstructorsDataFailed: (state) => {
      state.table.status = RequestStatus.ERROR;
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
    updateFilters: (state, { payload }) => {
      state.filters = payload;
    },
  },
});

export const {
  updateCurrentPage,
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  fetchCoursesDataRequest,
  fetchCoursesDataSuccess,
  fetchCoursesDataFailed,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
  updateFilters,
} = instructorsSlice.actions;

export const { reducer } = instructorsSlice;
