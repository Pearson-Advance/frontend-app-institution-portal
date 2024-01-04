/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  institution: {
    data: [],
    status: RequestStatus.LOADING,
    error: null,
  },
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
  },
});

export const {
  fetchInstitutionDataRequest,
  fetchInstitutionDataSuccess,
  fetchInstitutionDataFailed,
} = mainSlice.actions;

export const { reducer } = mainSlice;
