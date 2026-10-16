/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

/**
 * Seeded Offerings data.
 *
 * Offerings are abstract templates (analogous to courses). The backend endpoint
 * is not available yet, so a single seeded Offering is shown on first load.
 */
export const SEED_OFFERINGS = [
  {
    id: 1,
    name: 'Sample Offering',
    numberOfRuns: 0,
  },
];

const initialState = {
  table: {
    data: SEED_OFFERINGS,
    status: RequestStatus.SUCCESS,
    count: SEED_OFFERINGS.length,
  },
};

export const offeringsSlice = createSlice({
  name: 'offerings',
  initialState,
  reducers: {
    resetOfferingsTable: (state) => {
      state.table = initialState.table;
    },
  },
});

export const {
  resetOfferingsTable,
} = offeringsSlice.actions;

export const { reducer } = offeringsSlice;
