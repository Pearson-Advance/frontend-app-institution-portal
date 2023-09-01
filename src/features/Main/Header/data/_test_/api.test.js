import { getInstitutionName } from 'features/Main/Header/data/api';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
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
