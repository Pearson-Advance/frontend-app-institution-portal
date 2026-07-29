import { logError } from '@edx/frontend-platform/logging';

import { getGradebookCsv } from 'features/Classes/data/api';
import { downloadGradebookCsv } from 'features/Classes/data/thunks';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({})),
  camelCaseObject: jest.fn((value) => value),
}));

jest.mock('features/Classes/data/api', () => ({
  getClassAnalyticsWidgets: jest.fn(),
  getGradebookCsv: jest.fn(),
  handleSkillableDashboard: jest.fn(),
  handleXtremeLabsDashboard: jest.fn(),
}));

describe('downloadGradebookCsv thunk', () => {
  const dispatch = jest.fn();
  const classId = 'ccx-v1:PX+CS00002+2023+ccx@39';
  let showToast;
  let clickMock;

  beforeEach(() => {
    jest.clearAllMocks();
    showToast = jest.fn();
    clickMock = jest.fn();

    window.URL.createObjectURL = jest.fn(() => 'blob:url');
    window.URL.revokeObjectURL = jest.fn();

    jest.spyOn(document, 'createElement').mockReturnValue({
      setAttribute: jest.fn(),
      click: clickMock,
      remove: jest.fn(),
      href: '',
    });
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Shows an in-progress toast and triggers the browser download', async () => {
    getGradebookCsv.mockResolvedValue({ data: 'name,grade\n' });

    await downloadGradebookCsv(classId, showToast)(dispatch);

    expect(showToast).toHaveBeenCalledWith(
      'Your gradebook download is in progress. This may take a moment.',
    );
    expect(getGradebookCsv).toHaveBeenCalledWith(classId);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
  });

  test('Shows an error toast and logs the error when the request fails', async () => {
    const error = new Error('Request failed');
    getGradebookCsv.mockRejectedValue(error);

    await downloadGradebookCsv(classId, showToast)(dispatch);

    expect(showToast).toHaveBeenLastCalledWith(
      'An error occurred while downloading the gradebook. Please try again.',
    );
    expect(clickMock).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith(error);
  });
});
