import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  handleInstructorsEnrollment,
  handleNewInstructor,
  getEventsByInstructor,
  getInstructorByEmail,
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
    const instructorForm = new FormData();
    instructorForm.append('instructor_email', 'instructor@example.com');
    instructorForm.append('first_name', 'Sam');
    instructorForm.append('last_name', 'F');

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleNewInstructor(institutionId, instructorForm);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/instructors/'
      + '?institution_id=1&instructor_email=instructor%40example.com&first_name=Sam&last_name=F',
    );
  });

  test('getEventsByInstructor', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const eventRequestInfo = {
      instructor_id: '3',
      start_date: '2024-12-01T05:00:00.000Z',
      end_date: '2025-01-01T04:59:59.999Z',
      page: '1',
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getEventsByInstructor({ ...eventRequestInfo });

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/events/',
      {
        params: {
          instructor_id: '3',
          start_date: '2024-12-01T05:00:00.000Z',
          end_date: '2025-01-01T04:59:59.999Z',
          page: '1',
        },
      },
    );
  });

  test('getInstructorByEmail', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getInstructorByEmail('edx@example.com');

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/instructors/',
      {
        params: {
          instructor_email: 'edx@example.com',
          limit: false,
        },
      },
    );
  });
});
