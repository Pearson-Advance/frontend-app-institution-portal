import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getInstructorData } from 'features/Instructors/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('getInstructorData', () => {
  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const page = 1;

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getInstructorData(page);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/instructors/',
      { params: { page } },
    );
  });
});
