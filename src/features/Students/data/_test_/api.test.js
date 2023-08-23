import { getStudentbyInstitutionAdmin } from 'features/Students/data/api';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
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

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
  });
});
