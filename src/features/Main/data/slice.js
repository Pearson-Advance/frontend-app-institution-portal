/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, initialStateService } from 'features/constants';

const initialState = {
  institution: {
    ...initialStateService,
  },
  activeTab: 'dashboard',
  selectedInstitution: {},
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
    updateSelectedInstitution: (state, { payload }) => {
      state.selectedInstitution = payload;
    },
  },
});

export const {
  fetchInstitutionDataRequest,
  fetchInstitutionDataSuccess,
  fetchInstitutionDataFailed,
  updateActiveTab,
  updateSelectedInstitution,
} = mainSlice.actions;

export const { reducer } = mainSlice;
