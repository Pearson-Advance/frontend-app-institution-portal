import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { camelCaseObject } from '@edx/frontend-platform';

import { getStudentsByInstitutionId } from 'features/Students/data/api';
import { initialPage } from 'features/constants';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['StudentsClass'],
  endpoints: (builder) => ({
    getStudentsByClass: builder.query({
      async queryFn({
        institutionId,
        page = initialPage,
        courseId,
        classId,
      }) {
        try {
          const response = camelCaseObject(await getStudentsByInstitutionId(institutionId, page, {
            course_id: courseId,
            class_id: classId,
            limit: true,
          }));

          return {
            data: {
              results: response.data.results,
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
      providesTags: ['StudentsClass'],
    }),
  }),
});

export const { useGetStudentsByClassQuery } = studentsApi;
