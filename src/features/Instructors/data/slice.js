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
  selectOptions: {
    status: RequestStatus.LOADING,
    data: [],
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
    updateInstructorAdditionRequest: (state, { payload }) => {
      state.addInstructor.status = payload.status;
      state.addInstructor.data = payload?.data || null;
      state.addInstructor.error = payload?.error || null;
    },
    resetInstructorAdditionRequest: (state) => {
      state.addInstructor.status = RequestStatus.INITIAL;
      state.addInstructor.data = null;
      state.addInstructor.error = null;
    },
    fetchInstructorOptionsRequest: (state) => {
      state.selectOptions.status = RequestStatus.LOADING;
    },
    fetchInstructorOptionsSuccess: (state, { payload }) => {
      state.selectOptions.data = payload;
      state.selectOptions.status = RequestStatus.SUCCESS;
    },
    fetchInstructorOptionsFailed: (state) => {
      state.selectOptions.status = RequestStatus.ERROR;
    },
    resetInstructorOptions: (state) => {
      state.selectOptions.status = RequestStatus.LOADING;
      state.selectOptions.data = [];
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
  resetInstructorAdditionRequest,
  updateInstructorAdditionRequest,
  fetchInstructorOptionsRequest,
  fetchInstructorOptionsSuccess,
  fetchInstructorOptionsFailed,
  resetInstructorOptions,
} = instructorsSlice.actions;

export const { reducer } = instructorsSlice;
