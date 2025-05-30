/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { startOfMonth, endOfMonth } from 'date-fns';

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
  filters: {
  },
  rowsSelected: [],
  classSelected: '',
  assignInstructors: {
    status: RequestStatus.INITIAL,
    error: null,
    data: null,
  },
  instructorForm: {
    status: RequestStatus.LOADING,
    error: null,
    data: null,
  },
  selectOptions: {
    status: RequestStatus.LOADING,
    data: [],
  },
  events: {
    data: [],
    status: RequestStatus.INITIAL,
    dates: {
      start_date: startOfMonth(new Date()).toISOString(),
      end_date: endOfMonth(new Date()).toISOString(),
    },
  },
  instructorProfile: {
    status: RequestStatus.LOADING,
    instructorImage: '',
    instructorName: '',
    lastAccess: '',
    created: '',
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
    resetInstructorsRequest: (state) => {
      state.table = initialState.table;
    },
    updateFilters: (state, { payload }) => {
      state.filters = payload;
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
    updateInstructorFormRequest: (state, { payload }) => {
      state.instructorForm.status = payload.status;
      state.instructorForm.data = payload?.data || null;
      state.instructorForm.error = payload?.error || null;
    },
    resetInstructorFormRequest: (state) => {
      state.instructorForm.status = RequestStatus.INITIAL;
      state.instructorForm.data = null;
      state.instructorForm.error = null;
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
    updateEvents: (state, { payload }) => {
      state.events.data = payload;
    },
    resetEvents: (state) => {
      state.events = initialState.events;
    },
    updateEventsRequestStatus: (state, { payload }) => {
      state.events.status = payload;
    },
    updateInstructorInfo: (state, { payload }) => {
      state.instructorProfile = payload;
    },
    resetInstructorInfo: (state) => {
      state.instructorProfile = initialState.instructorProfile;
    },
    updateInstructorInfoStatus: (state, { payload }) => {
      state.instructorProfile.status = payload;
    },
  },
});

export const {
  resetEvents,
  updateEvents,
  updateCurrentPage,
  updateEventsRequestStatus,
  fetchInstructorsDataRequest,
  fetchInstructorsDataSuccess,
  fetchInstructorsDataFailed,
  resetInstructorsRequest,
  updateFilters,
  assignInstructorsRequest,
  assignInstructorsSuccess,
  assignInstructorsFailed,
  addRowSelect,
  deleteRowSelect,
  resetRowSelect,
  resetInstructorFormRequest,
  updateInstructorFormRequest,
  fetchInstructorOptionsRequest,
  fetchInstructorOptionsSuccess,
  fetchInstructorOptionsFailed,
  resetInstructorOptions,
  updateInstructorInfo,
  resetInstructorInfo,
  updateInstructorInfoStatus,
} = instructorsSlice.actions;

export const { reducer } = instructorsSlice;
