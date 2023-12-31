import {
  getStudentbyInstitutionAdmin, handleEnrollments, getClassesByInstitution,
} from 'features/Students/data/api';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('getStudentbyInstitutionAdmin', () => {
  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const page = 1;

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getStudentbyInstitutionAdmin(page);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/students/',
      { params: { page } },
    );
  });
});

describe('handleEnrollments', () => {
  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      post: jest.fn(),
    };
    const courseId = 'course123';
    const data = new FormData();

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleEnrollments(data, courseId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(2);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/courses/course123/instructor/api/students_update_enrollment',
      data,
    );
  });
});

describe('getClassesByInstitution', () => {
  test('should call getClassesByInstitution with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const institutionId = 1;
    const courseName = 'ccx1';

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getClassesByInstitution(institutionId, courseName);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(3);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/classes/?limit=false&institution_id=1&course_name=ccx1',
    );
  });
});
