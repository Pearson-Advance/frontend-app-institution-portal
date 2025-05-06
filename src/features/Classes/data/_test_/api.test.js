import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { handleSkillableDashboard, handleXtremeLabsDashboard } from 'features/Classes/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('API functions', () => {
  const mockPost = jest.fn();
  const mockConfig = {
    LMS_BASE_URL: 'https://example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticatedHttpClient.mockReturnValue({ post: mockPost });
    getConfig.mockReturnValue(mockConfig);
  });

  describe('handleSkillableDashboard', () => {
    it('should call the correct API endpoint with the correct payload', async () => {
      const courseId = '12345';
      const expectedUrl = `${mockConfig.LMS_BASE_URL}/skillable_plugin/course-tab/api/v1/instructor-dashboard-launch/`;
      const expectedPayload = { class_id: courseId };

      await handleSkillableDashboard(courseId);

      expect(getAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, expectedPayload);
    });
  });

  describe('handleXtremeLabsDashboard', () => {
    it('should call the correct API endpoint with the correct payload', async () => {
      const courseId = '67890';
      const expectedUrl = `${mockConfig.LMS_BASE_URL}/xtreme_labs_plugin/course-tab/api/v1/instructor-dashboard-launch/`;
      const expectedPayload = { class_id: courseId };

      await handleXtremeLabsDashboard(courseId);

      expect(getAuthenticatedHttpClient).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, expectedPayload);
    });
  });
});
