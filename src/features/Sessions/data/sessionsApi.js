import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';

import {
  handleNewSession,
  handleEditSession,
  handleDeleteSession,
  enrollStudentToSession,
  getSessionsByOffering,
  getSessionDetail,
  getAllSessions,
} from 'features/Sessions/data/api';
import { studentsApi } from 'features/Students/data/studentsApi';
import { initialPage } from 'features/constants';

export const sessionsApi = createApi({
  reducerPath: 'sessionsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Sessions', 'SessionsOptions', 'SessionDetail'],
  endpoints: (builder) => ({
    getSessionsList: builder.query({
      async queryFn({ institutionId, page = initialPage, params = {} }) {
        try {
          const response = camelCaseObject(
            await getAllSessions(institutionId, page, params),
          );

          return {
            data: {
              ...response.data,
              results: response.data.results || [],
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
    getSessionsByOffering: builder.query({
      async queryFn({
        institutionId, offeringId, page = initialPage, params = {},
      }) {
        try {
          const response = camelCaseObject(
            await getSessionsByOffering(institutionId, offeringId, page, params),
          );

          return {
            data: {
              ...response.data,
              results: response.data.results || [],
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
      async queryFn(body) {
        try {
          const response = await handleNewSession(body);
          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
              message: error?.message,
            },
          };
        }
      },
      invalidatesTags: ['Sessions', 'SessionsOptions'],
    }),
    editSession: builder.mutation({
      async queryFn({ data, params }) {
        try {
          const response = await handleEditSession(data, params);
          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
              message: error?.message,
            },
          };
        }
      },
      invalidatesTags: ['Sessions', 'SessionDetail'],
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
      async queryFn({ offeringRunId, data }) {
        try {
          const response = await enrollStudentToSession(offeringRunId, data);
          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              data: error?.response?.data,
              message: error?.message,
            },
          };
        }
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(studentsApi.util.invalidateTags(['StudentsClass']));
        } catch {
          // Mutation failed; nothing to invalidate.
        }
      },
      invalidatesTags: ['Sessions', 'SessionDetail', 'SessionsOptions'],
    }),
  }),
});

export const {
  useGetSessionsListQuery,
  useGetSessionsByOfferingQuery,
  useAddSessionMutation,
  useEditSessionMutation,
  useDeleteSessionMutation,
  useEnrollStudentInSessionMutation,
  useGetSessionDetailQuery,
} = sessionsApi;
