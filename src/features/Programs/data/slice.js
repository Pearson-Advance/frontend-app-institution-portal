/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

/**
 * Seeded Programs data.
 *
 * Programs are abstract templates (analogous to courses). The backend endpoint
 * is not available yet, so this seeded data is shown on first load. The shape
 * mirrors the planned API contract so the mock can be swapped out with minimal
 * changes. `courses` holds the read-only constituent courses surfaced in the
 * Program detail view.
 */
export const SEED_PROGRAMS = [
  {
    id: 1,
    name: 'Cloud Practitioner Program',
    numberOfCourses: 3,
    numberOfRuns: 2,
    studentsEnrolled: 48,
    courses: [
      {
        id: 101, sequence: 1, name: 'Cloud Foundations', weight: 20,
      },
      {
        id: 102, sequence: 2, name: 'Cloud Architecture Essentials', weight: 30,
      },
      {
        id: 103, sequence: 3, name: 'Cloud Security Basics', weight: 50,
      },
    ],
  },
  {
    id: 2,
    name: 'Data Analytics Program',
    numberOfCourses: 2,
    numberOfRuns: 0,
    studentsEnrolled: 0,
    courses: [
      {
        id: 201, sequence: 1, name: 'Data Analysis Fundamentals', weight: 40,
      },
      {
        id: 202, sequence: 2, name: 'Visualization with Dashboards', weight: 60,
      },
    ],
  },
];

const initialState = {
  table: {
    data: SEED_PROGRAMS,
    status: RequestStatus.SUCCESS,
    count: SEED_PROGRAMS.length,
  },
};

export const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    resetProgramsTable: (state) => {
      state.table = initialState.table;
    },
  },
});

export const {
  resetProgramsTable,
} = programsSlice.actions;

export const { reducer } = programsSlice;
