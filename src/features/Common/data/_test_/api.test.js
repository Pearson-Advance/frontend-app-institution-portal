import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getCoursesByInstitution,
  getLicensesByInstitution,
  getClassesByInstitution,
} from 'features/Common/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('Common api services', () => {
  const COURSE_OPERATIONS_API_V2 = 'http://localhost:18000/pearson_course_operation/api/v2';
  test('should call getCoursesByInstitution with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const institutionId = 1;
    const page = 1;

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getCoursesByInstitution(institutionId, true, page);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${COURSE_OPERATIONS_API_V2}/courses/?limit=true&institution_id=1`,
      { params: { page } },
    );
  });

  test('should call getLicensesByInstitution with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const institutionId = 1;

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getLicensesByInstitution(institutionId, true);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(2);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${COURSE_OPERATIONS_API_V2}/license-pool/?limit=true&institution_id=1&page=`,
    );
  });

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
      `${COURSE_OPERATIONS_API_V2}/classes/?limit=false&institution_id=1&course_name=ccx1&instructors=&page=`,
    );
  });
});
