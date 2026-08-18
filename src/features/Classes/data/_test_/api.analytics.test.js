import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import {
  getClassAnalyticsWidgets,
  getSupersetAnalyticsStatus,
} from 'features/Classes/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('Class analytics widgets API', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticatedHttpClient.mockReturnValue({ get: mockGet });
  });

  test('calls Course Operations analytics widgets endpoint with flat query params', async () => {
    getConfig.mockReturnValue({
      COURSE_OPERATIONS_API_V2_BASE_URL: 'https://example.com/pearson_course_operation/api/v2',
      LMS_BASE_URL: 'https://example.com',
    });

    await getClassAnalyticsWidgets({
      institutionId: 2,
      classId: 'ccx-v1:PX+CS00002+2023+ccx@39',
    });

    expect(getAuthenticatedHttpClient).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith(
      'https://example.com/pearson_course_operation/api/v2/classes/analytics-widgets/',
      {
        params: {
          institution_id: 2,
          class_id: 'ccx-v1:PX+CS00002+2023+ccx@39',
        },
      },
    );
  });

  test('calls the current-user Superset analytics status endpoint', async () => {
    getConfig.mockReturnValue({
      COURSE_OPERATIONS_API_V2_BASE_URL: 'https://example.com/pearson_course_operation/api/v2/',
      LMS_BASE_URL: 'https://example.com',
    });

    await getSupersetAnalyticsStatus();

    expect(mockGet).toHaveBeenCalledWith(
      'https://example.com/pearson_course_operation/api/v2/classes/analytics-status/',
    );
  });

  test('builds base URL from LMS_BASE_URL when Course Operations API base URL is missing', async () => {
    getConfig.mockReturnValue({
      LMS_BASE_URL: 'https://example.com/',
    });

    await getClassAnalyticsWidgets({
      institutionId: 2,
      classId: 'ccx-v1:PX+CS00002+2023+ccx@39',
    });

    expect(mockGet).toHaveBeenCalledWith(
      'https://example.com/pearson_course_operation/api/v2/classes/analytics-widgets/',
      expect.objectContaining({
        params: {
          institution_id: 2,
          class_id: 'ccx-v1:PX+CS00002+2023+ccx@39',
        },
      }),
    );
  });
});
