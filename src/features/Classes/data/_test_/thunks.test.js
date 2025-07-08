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

    const res = await supersetUrlClassesDashboard('abc123');
    expect(res).toBeNull();
    expect(global.fetch).toBeUndefined();
  });

  test('builds the correct login URL when the user has NO Superset session', async () => {
    getConfig.mockReturnValue({
      SUPERSET_HOST: 'https://superset.example.com',
      SUPERSET_DASHBOARD_SLUG: 'classes',
      SUPERSET_CLASS_FILTER_ID: 'filter_id',
    });

    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    const classId = 'course-v1:Demo+Test+2025';
    const url = await supersetUrlClassesDashboard(classId);

    const dashPath = `/superset/dashboard/classes/?native_filters=${encodeURIComponent('ENCODED')}`
      + '&standalone=true&expand_filters=0';

    const expected = `https://superset.example.com/login/?next=${encodeURIComponent(dashPath)}`;

    expect(url).toBe(expected);

    expect(risonEncode).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_id: expect.objectContaining({
          filterState: { value: [classId], label: classId },
        }),
      }),
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://superset.example.com/api/v1/me/',
      expect.any(Object),
    );
  });

  test('returns the direct dashboard URL when the user already HAS a Superset session', async () => {
    getConfig.mockReturnValue({
      SUPERSET_HOST: 'https://superset.example.com',
      SUPERSET_DASHBOARD_SLUG: 'classes',
      SUPERSET_CLASS_FILTER_ID: 'filter_id',
    });

    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));

    const classId = 'course-v1:Demo+Test+2025';
    const url = await supersetUrlClassesDashboard(classId);

    const dashPath = `/superset/dashboard/classes/?native_filters=${encodeURIComponent('ENCODED')}`
      + '&standalone=true&expand_filters=0';

    const expected = `https://superset.example.com${dashPath}`;

    expect(url).toBe(expected);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://superset.example.com/api/v1/me/',
      expect.any(Object),
    );
  });
});
