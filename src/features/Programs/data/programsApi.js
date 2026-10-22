import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';
import { getProgramDetail } from 'features/Programs/data/api';

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
  }),
});

export const { useGetProgramDetailQuery } = programsApi;
