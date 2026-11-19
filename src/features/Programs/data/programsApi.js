import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';
import { getPrograms, getProgramDetail } from 'features/Programs/data/api';
import { getLicensesByInstitution } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

export const programsApi = createApi({
  reducerPath: 'programsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Programs', 'ProgramDetail', 'ProgramCourses'],
  endpoints: (builder) => ({
    getProgramsList: builder.query({
      async queryFn({
        institutionId, page = initialPage, limit = 10, params = {},
      }) {
        try {
          const response = camelCaseObject(
            await getPrograms(institutionId, page, limit, params),
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
      providesTags: ['Programs'],
    }),

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
      async queryFn({ programId, institutionId }) {
        try {
          const response = camelCaseObject(
            await getProgramDetail(programId, institutionId),
          );
          const courses = response.data?.courses || [];

          return {
            data: {
              count: courses.length,
              numPages: 1,
              results: courses,
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
      providesTags: ['ProgramCourses'],
    }),
    getInstitutionLicenses: builder.query({
      async queryFn({ institutionId }) {
        try {
          const response = camelCaseObject(
            await getLicensesByInstitution(institutionId, false, 1, { type: 'offering' }),
          );
          const rawLicenses = Array.isArray(response.data) ? response.data : [];

          const options = rawLicenses.map((license) => ({
            value: license.licenseId,
            label: license.licenseName,
            raw: license,
          }));

          return { data: options };
        } catch (error) {
          return {
            error: {
              status: error?.response?.status,
              message: error?.message,
            },
          };
        }
      },
      providesTags: ['InstitutionLicenses'],
    }),
  }),
});

export const {
  useGetProgramsListQuery,
  useGetProgramDetailQuery,
  useGetCoursesByProgramQuery,
  useGetInstitutionLicensesQuery,
} = programsApi;
