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

export const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    resetSessionsTable: (state) => {
      state.table = initialState.table;
    },
  },
});

export const {
  resetSessionsTable,
} = sessionsSlice.actions;

export const { reducer } = sessionsSlice;
