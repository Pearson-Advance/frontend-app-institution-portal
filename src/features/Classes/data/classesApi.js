import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import { getClassesByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

export const classesApi = createApi({
  reducerPath: 'classesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Classes'],
  endpoints: (builder) => ({
    getClasses: builder.query({
      async queryFn({
        institutionId,
        page = initialPage,
        filters = {},
        limit = true,
      }) {
        try {
          const { courseId = '', ...params } = filters;
          const response = camelCaseObject(
            await getClassesByInstitution(institutionId, courseId, limit, page, params),
          );

          return {
            data: {
              results: sortAlphabetically(response.data.results, 'className'),
              count: response.data.count,
              numPages: response.data.numPages,
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
      providesTags: ['Classes'],
    }),
    /**
     * Fetches every class of a given course (no pagination limit).
     */
    getClassesByCourse: builder.query({
      async queryFn({ institutionId, courseId = '' }) {
        try {
          const response = camelCaseObject(
            await getClassesByInstitution(institutionId, courseId, false),
          );

          return { data: sortAlphabetically(response.data, 'className') };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              message: error?.message,
            },
          };
        }
      },
      providesTags: ['Classes'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassesByCourseQuery,
} = classesApi;
