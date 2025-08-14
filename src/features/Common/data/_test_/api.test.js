import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getCoursesByInstitution,
  getLicensesByInstitution,
  getClassesByInstitution,
  getInstructorByInstitution,
  isFeatureEnabled,
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
    const httpClientMock = { get: jest.fn() };
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
    const httpClientMock = { get: jest.fn() };
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
          institution_id: 1,
          limit: false,
          page: '',
          page_size: MAX_TABLE_RECORDS,
        },
      },
    );
  });

  test('getInstructorData', () => {
    const httpClientMock = { get: jest.fn() };
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

describe('isFeatureEnabled (user-assigned flags)', () => {
  const ENABLED_FLAGS_URL = 'http://localhost:18000/pearson-core/feature-flags/enabled-flags/';

  afterEach(() => {
    // clear mocks and the function-scoped cache between tests
    jest.clearAllMocks();
    delete isFeatureEnabled.enabledFlagsSet;
  });

  test('returns true when the flag is present in enabled_flags', async () => {
    const httpClientMock = { get: jest.fn().mockResolvedValue({ data: { enabled_flags: ['foo.flag'] } }) };
    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    const result = await isFeatureEnabled({ flagName: 'foo.flag' });

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(ENABLED_FLAGS_URL, { withCredentials: true });
    expect(result).toBe(true);
  });

  test('returns false when the flag is not present', async () => {
    const httpClientMock = { get: jest.fn().mockResolvedValue({ data: { enabled_flags: ['bar.flag'] } }) };
    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    const result = await isFeatureEnabled({ flagName: 'foo.flag' });

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  test('caches the enabled_flags list after first call', async () => {
    const httpClientMock = { get: jest.fn().mockResolvedValue({ data: { enabled_flags: ['only.this'] } }) };
    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    const first = await isFeatureEnabled({ flagName: 'only.this' });
    const second = await isFeatureEnabled({ flagName: 'other.flag' });

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(first).toBe(true);
    expect(second).toBe(false);
  });

  test('returns null on malformed response', async () => {
    const httpClientMock = { get: jest.fn().mockResolvedValue({ data: {} }) };
    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    const result = await isFeatureEnabled({ flagName: 'foo.flag' });

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  test('returns null on request error', async () => {
    const httpClientMock = { get: jest.fn().mockRejectedValue(new Error('network')) };
    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    const result = await isFeatureEnabled({ flagName: 'foo.flag' });

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});
