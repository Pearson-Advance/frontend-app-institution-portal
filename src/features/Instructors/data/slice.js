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
  filters: {
  },
  rowsSelected: [],
  classSelected: '',
  assignInstructors: {
    status: RequestStatus.LOADING,
    error: null,
    data: null,
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
    updateClassSelected: (state, { payload }) => {
      state.classSelected = payload;
    },
    assingInstructorsRequest: (state) => {
      state.assignInstructors.status = RequestStatus.LOADING;
    },
    assingInstructorsSuccess: (state, { payload }) => {
      state.assignInstructors.status = RequestStatus.SUCCESS;
      state.assignInstructors.data = payload;
    },
    assingInstructorsFailed: (state) => {
      state.assignInstructors.status = RequestStatus.ERROR;
    },
    addRowSelect: (state, { payload }) => {
      state.rowsSelected = [...state.rowsSelected, payload];
    },
    deleteRowSelect: (state, { payload }) => {
      state.rowsSelected = state.rowsSelected.filter(row => row !== payload);
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
  updateClassSelected,
  assingInstructorsRequest,
  assingInstructorsSuccess,
  assingInstructorsFailed,
  addRowSelect,
  deleteRowSelect,
} = instructorsSlice.actions;

export const { reducer } = instructorsSlice;
