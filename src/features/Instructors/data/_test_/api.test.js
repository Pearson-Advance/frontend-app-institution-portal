import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  handleInstructorsEnrollment,
  handleNewInstructor,
} from 'features/Instructors/data/api';

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

  test('handleInstructorsEnrollment', () => {
    const httpClientMock = {
      post: jest.fn(),
    };

    const courseId = 'course123';
    const data = new FormData();

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleInstructorsEnrollment(data, courseId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/assign-instructor/',
      data,
    );
  });

  test('handleNewInstructor', () => {
    const httpClientMock = {
      post: jest.fn(),
    };

    const institutionId = '1';
    const instructorEmail = 'testEmail@example.com';

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleNewInstructor(institutionId, instructorEmail);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/instructors/'
      + '?instructor_email=testEmail@example.com&institution_id=1',
    );
  });
});
