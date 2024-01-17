/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, initialStateService } from 'features/constants';

const initialState = {
  institution: {
    ...initialStateService,
  },
  activeTab: 'dashboard',
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    fetchInstitutionDataRequest: (state) => {
      state.institution.status = RequestStatus.LOADING;
    },
    fetchInstitutionDataSuccess: (state, { payload }) => {
      state.institution.status = RequestStatus.SUCCESS;
      state.institution.data = payload;
    },
    fetchInstitutionDataFailed: (state) => {
      state.institution.status = RequestStatus.ERROR;
    },
    updateActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
  },
});

export const {
  fetchInstitutionDataRequest,
  fetchInstitutionDataSuccess,
  fetchInstitutionDataFailed,
  updateActiveTab,
} = mainSlice.actions;

export const { reducer } = mainSlice;
