import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';

import { getInstructorByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

export const instructorsApi = createApi({
  reducerPath: 'instructorsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['InstructorsOptions'],
  endpoints: (builder) => ({
    getInstructorsOptions: builder.query({
      async queryFn({ institutionId, page = initialPage, filters = {} }) {
        try {
          const response = camelCaseObject(
            await getInstructorByInstitution(institutionId, page, filters),
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
      providesTags: ['InstructorsOptions'],
    }),
  }),
});

export const { useGetInstructorsOptionsQuery } = instructorsApi;
