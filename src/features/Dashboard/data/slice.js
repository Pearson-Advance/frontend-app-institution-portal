/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, initialStateService } from 'features/constants';

const initialState = {
  tableLicense: {
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
  },
});

export const {
  fetchLicensesDataRequest,
  fetchLicensesDataSuccess,
  fetchLicensesDataFailed,
} = dashboardSlice.actions;

export const { reducer } = dashboardSlice;
