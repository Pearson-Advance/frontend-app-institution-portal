import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getCoursesByInstitution,
  getLicensesByInstitution,
  getClassesByInstitution,
  getInstructorByInstitution,
} from 'features/Common/data/api';

import { MAX_TABLE_RECORDS } from 'features/constants';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

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
      { params: { page, page_size: MAX_TABLE_RECORDS } },
    );
  });

  test('should call getLicensesByInstitution with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const institutionId = 1;

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getLicensesByInstitution(institutionId, true);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${COURSE_OPERATIONS_API_V2}/license-pool/?limit=true&institution_id=1`,
      {
        params: {
          page: 1,
          page_size: MAX_TABLE_RECORDS,
        },
      },
    );
  });

  test('should call getClassesByInstitution with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const institutionId = 1;
    const courseId = 'course-v1';

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getClassesByInstitution(institutionId, courseId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${COURSE_OPERATIONS_API_V2}/classes/?course_id=course-v1`,
      {
        params: {
          institution_id: 1, limit: false, page: '', page_size: MAX_TABLE_RECORDS,
        },
      },
    );
  });

  test('getInstructorData', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const page = 1;
    const institutionId = 1;

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getInstructorByInstitution(institutionId, page);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/instructors/',
      {
        params: {
          page, institution_id: institutionId, limit: false, page_size: MAX_TABLE_RECORDS,
        },
      },
    );
  });
});
