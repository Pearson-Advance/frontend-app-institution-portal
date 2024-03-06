import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { handleNewClass } from 'features/Courses/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('should call getAuthenticatedHttpClient with the correct parameters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handleNewClass', () => {
    const httpClientMock = {
      post: jest.fn(),
    };

    const data = new FormData();

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleNewClass(data);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:18000/pearson_course_operation/api/v2/create-class/', data);
  });
});
