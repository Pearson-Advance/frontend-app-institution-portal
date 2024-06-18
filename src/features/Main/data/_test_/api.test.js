import { getInstitutionName, assignStaffRole } from 'features/Main/data/api';
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

describe('getInstitutionName', () => {
  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };
    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getInstitutionName();

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
  });
});

describe('assignStaffRole', () => {
  test('Should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      post: jest.fn(),
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    assignStaffRole('example+123');
    const data = new FormData();
    data.append('class_id', 'example+123');

    expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:18000/pearson_course_operation/api/v2/assign-staff/', data);
  });
});
