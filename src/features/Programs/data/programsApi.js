import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';
import { getProgramDetail, getCoursesByProgram } from 'features/Programs/data/api';

export const programsApi = createApi({
  reducerPath: 'programsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ProgramDetail'],
  endpoints: (builder) => ({
    getProgramDetail: builder.query({
      async queryFn({ programId, institutionId }) {
        try {
          const response = camelCaseObject(
            await getProgramDetail(programId, institutionId),
          );
          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              message: error?.message,
            },
          };
        }
      },
      providesTags: ['ProgramDetail'],
    }),

    getCoursesByProgram: builder.query({
      async queryFn({ programId, institutionId, page }) {
        try {
          const response = camelCaseObject(
            await getCoursesByProgram(programId, institutionId, page),
          );
          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              message: error?.message,
            },
          };
        }
      },
      providesTags: ['ProgramCourses'],
    }),
  }),
});

export const {
  useGetProgramDetailQuery,
  useGetCoursesByProgramQuery,
} = programsApi;
