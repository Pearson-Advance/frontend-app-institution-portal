import { supersetUrlClassesDashboard } from 'features/Classes/data/thunks';
import { getConfig } from '@edx/frontend-platform';
import { encode as risonEncode } from 'rison-node';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('rison-node', () => ({
  encode: jest.fn(() => 'ENCODED'), // deterministic stub
}));

describe('supersetUrlClassesDashboard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns null when any required config value is missing', () => {
    getConfig.mockReturnValue({
      SUPERSET_HOST: '',
      SUPERSET_DASHBOARD_SLUG: 'classes',
      SUPERSET_CLASS_FILTER_ID: 'filter_id',
    });

    expect(supersetUrlClassesDashboard('abc123')).toBeNull();
  });

  test('builds the correct login URL when all config values are present', () => {
    getConfig.mockReturnValue({
      SUPERSET_HOST: 'https://superset.example.com',
      SUPERSET_DASHBOARD_SLUG: 'classes',
      SUPERSET_CLASS_FILTER_ID: 'filter_id',
    });

    const classId = 'course-v1:Demo+Test+2025';
    const url = supersetUrlClassesDashboard(classId);

    const dashPath = `/superset/dashboard/classes/?native_filters=${encodeURIComponent('ENCODED')}&standalone=true`;
    const expected = `https://superset.example.com/login/?next=${encodeURIComponent(dashPath)}`;

    expect(url).toBe(expected);

    expect(risonEncode).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_id: expect.objectContaining({
          filterState: { value: [classId], label: classId },
        }),
      }),
    );
  });
});
