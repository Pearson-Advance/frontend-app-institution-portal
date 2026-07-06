import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import { getCoursesByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['CoursesOptions'],
  endpoints: (builder) => ({
    getCoursesOptions: builder.query({
      async queryFn({
        institutionId,
        limit = false,
        page = initialPage,
        params = {},
      }) {
        try {
          const response = camelCaseObject(
            await getCoursesByInstitution(institutionId, limit, page, params),
          );

          return { data: sortAlphabetically(response.data) };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              message: error?.message,
            },
          };
        }
      },
      providesTags: ['CoursesOptions'],
    }),
  }),
});

export const { useGetCoursesOptionsQuery } = coursesApi;
