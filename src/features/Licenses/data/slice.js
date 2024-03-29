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
};

export const licensesSlice = createSlice({
  name: 'licenses',
  initialState,
  reducers: {
    updateCurrentPage: (state, { payload }) => {
      state.table.currentPage = payload;
    },
    fetchLicensesDataRequest: (state) => {
      state.table.status = RequestStatus.LOADING;
    },
    fetchLicensesDataSuccess: (state, { payload }) => {
      const { results, count, numPages } = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.data = results;
      state.table.numPages = numPages;
      state.table.count = count;
    },
    fetchLicensesDataFailed: (state) => {
      state.table.status = RequestStatus.ERROR;
    },
    updateFilters: (state, { payload }) => {
      state.filters = payload;
    },
    updateLicensesOptions: (state, { payload }) => {
      state.selectOptions = payload;
    },
  },
});

export const {
  updateFilters,
  updateCurrentPage,
  fetchLicensesDataRequest,
  fetchLicensesDataSuccess,
  fetchLicensesDataFailed,
  updateLicensesOptions,
} = licensesSlice.actions;

export const { reducer } = licensesSlice;
