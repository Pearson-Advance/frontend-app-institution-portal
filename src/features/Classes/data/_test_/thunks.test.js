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
  const originalFetch = global.fetch;

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  test('returns null when any required config value is missing', async () => {
    getConfig.mockReturnValue({
      SUPERSET_HOST: '',
      SUPERSET_DASHBOARD_SLUG: 'classes',
      SUPERSET_CLASS_FILTER_ID: 'filter_id',
    });

    const res = supersetUrlClassesDashboard('abc123');
    expect(res).toBeNull();
  });

  test('builds the correct dashboard URL when config values are present', () => {
    getConfig.mockReturnValue({
      SUPERSET_HOST: 'https://superset.example.com',
      SUPERSET_DASHBOARD_SLUG: 'classes',
      SUPERSET_CLASS_FILTER_ID: 'filter_id',
    });

    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    const classId = 'course-v1:Demo+Test+2025';
    const url = supersetUrlClassesDashboard(classId);

    const dashPath = `/superset/dashboard/classes/?native_filters=${encodeURIComponent('ENCODED')}`
    + '&standalone=3&expand_filters=0';

    const expected = `https://superset.example.com${dashPath}`;

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
