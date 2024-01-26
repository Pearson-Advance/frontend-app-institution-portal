/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, initialStateService } from 'features/constants';

const initialState = {
  tableLicense: {
    ...initialStateService,
  },
  classes: {
    ...initialStateService,
  },
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchLicensesDataRequest: (state) => {
      state.tableLicense.status = RequestStatus.LOADING;
    },
    fetchLicensesDataSuccess: (state, { payload }) => {
      state.tableLicense.status = RequestStatus.SUCCESS;
      state.tableLicense.data = payload;
    },
    fetchLicensesDataFailed: (state) => {
      state.tableLicense.status = RequestStatus.ERROR;
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
  },
});

export const {
  fetchLicensesDataRequest,
  fetchLicensesDataSuccess,
  fetchLicensesDataFailed,
  fetchClassesDataRequest,
  fetchClassesDataSuccess,
  fetchClassesDataFailed,
} = dashboardSlice.actions;

export const { reducer } = dashboardSlice;
