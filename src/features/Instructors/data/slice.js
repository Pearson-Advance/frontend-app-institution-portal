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
  filters: {
  },
  rowsSelected: [],
  classSelected: '',
  assignInstructors: {
    status: RequestStatus.LOADING,
    error: null,
    data: null,
  },
  addInstructor: {
    status: RequestStatus.LOADING,
    error: null,
    data: null,
  },
  selectOptions: [],
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
    updateFilters: (state, { payload }) => {
      state.filters = payload;
    },
    updateClassSelected: (state, { payload }) => {
      state.classSelected = payload;
    },
    assignInstructorsRequest: (state) => {
      state.assignInstructors.status = RequestStatus.LOADING;
    },
    assignInstructorsSuccess: (state, { payload }) => {
      state.assignInstructors.status = RequestStatus.SUCCESS;
      state.assignInstructors.data = payload;
    },
    assignInstructorsFailed: (state) => {
      state.assignInstructors.status = RequestStatus.ERROR;
    },
    addRowSelect: (state, { payload }) => {
      state.rowsSelected = [...state.rowsSelected, payload];
    },
    deleteRowSelect: (state, { payload }) => {
      state.rowsSelected = state.rowsSelected.filter(row => row !== payload);
    },
    resetRowSelect: (state) => {
      state.rowsSelected = [];
    },
    addInstructorRequest: (state) => {
      state.addInstructor.status = RequestStatus.LOADING;
    },
    addInstructorSuccess: (state, { payload }) => {
      state.addInstructor.status = RequestStatus.SUCCESS;
      state.addInstructor.data = payload;
    },
    addInstructorFailed: (state) => {
      state.addInstructor.status = RequestStatus.ERROR;
    },
    updateInstructorOptions: (state, { payload }) => {
      state.selectOptions = payload;
    },
  },
});

export const {
  updateCurrentPage,
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  updateFilters,
  updateClassSelected,
  assignInstructorsRequest,
  assignInstructorsSuccess,
  assignInstructorsFailed,
  addRowSelect,
  deleteRowSelect,
  resetRowSelect,
  addInstructorRequest,
  addInstructorSuccess,
  addInstructorFailed,
  updateInstructorOptions,
} = instructorsSlice.actions;

export const { reducer } = instructorsSlice;
