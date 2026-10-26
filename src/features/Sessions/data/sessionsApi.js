import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import {
  handleNewSession,
  handleEditSession,
  handleDeleteSession,
  enrollStudentToSession,
  getSessionsByOffering,
  getSessionDetail,
} from 'features/Sessions/data/api';
import { initialPage } from 'features/constants';

export const sessionsApi = createApi({
  reducerPath: 'sessionsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Sessions', 'SessionsOptions'],
  endpoints: (builder) => ({
    getSessionsByOffering: builder.query({
      async queryFn({
        institutionId, offeringId, page = initialPage, params = {},
      }) {
        try {
          const response = camelCaseObject(
            await getSessionsByOffering(institutionId, offeringId, page, 10, params),
          );

          const sortedSessions = sortAlphabetically(response.data.results || []);

          return {
            data: {
              ...response.data,
              results: sortedSessions,
            },
          };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              message: error?.message,
            },
          };
        }
      },
      providesTags: ['Sessions'],
    }),
    getSessionDetail: builder.query({
      async queryFn({ institutionId, sessionId, params = {} }) {
        try {
          const response = camelCaseObject(
            await getSessionDetail(institutionId, sessionId, params),
          );

          return {
            data: response.data,
          };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              message: error?.message,
            },
          };
        }
      },
      providesTags: ['SessionDetail'],
    }),
    addSession: builder.mutation({
      async queryFn(sessionData) {
        try {
          const response = await handleNewSession(sessionData);
          return { data: response.data };
        } catch (error) {
          return { error: error?.response?.data || error?.message };
        }
      },
      invalidatesTags: ['Sessions', 'SessionsOptions'],
    }),
    editSession: builder.mutation({
      async queryFn(sessionData) {
        try {
          const response = await handleEditSession(sessionData);
          return { data: response.data };
        } catch (error) {
          return { error: error?.response?.data || error?.message };
        }
      },
      invalidatesTags: ['Sessions'],
    }),
    deleteSession: builder.mutation({
      async queryFn(sessionId) {
        try {
          const response = await handleDeleteSession(sessionId);
          return { data: response.data };
        } catch (error) {
          return { error: error?.response?.data || error?.message };
        }
      },
      invalidatesTags: ['Sessions', 'SessionsOptions'],
    }),
    enrollStudentInSession: builder.mutation({
      async queryFn(enrollmentData) {
        try {
          const response = await enrollStudentToSession(enrollmentData);
          return { data: response.data };
        } catch (error) {
          return { error: error?.response?.data || error?.message };
        }
      },
      invalidatesTags: ['Sessions'],
    }),
  }),
});

export const {
  useGetSessionsByOfferingQuery,
  useAddSessionMutation,
  useEditSessionMutation,
  useDeleteSessionMutation,
  useEnrollStudentInSessionMutation,
  useGetSessionDetailQuery,
} = sessionsApi;
