/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  table: {
    data: [],
    status: RequestStatus.SUCCESS,
    count: 0,
  },
};

export const offeringRunsSlice = createSlice({
  name: 'offeringRuns',
  initialState,
  reducers: {
    resetOfferingRunsTable: (state) => {
      state.table = initialState.table;
    },
  },
});

export const {
  resetOfferingRunsTable,
} = offeringRunsSlice.actions;

export const { reducer } = offeringRunsSlice;
