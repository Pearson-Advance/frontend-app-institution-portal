import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';

import { getClassAnalyticsWidgets } from 'features/Classes/data/api';
import {
  fetchClassAnalyticsWidgets,
} from 'features/Classes/data/thunks';
import {
  fetchClassAnalyticsWidgetsRequest,
  fetchClassAnalyticsWidgetsSuccess,
  fetchClassAnalyticsWidgetsFailed,
} from 'features/Classes/data/slice';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({})),
  camelCaseObject: jest.fn((value) => value),
}));

jest.mock('features/Classes/data/api', () => ({
  getClassAnalyticsWidgets: jest.fn(),
  handleSkillableDashboard: jest.fn(),
  handleXtremeLabsDashboard: jest.fn(),
}));

describe('Class analytics thunks', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should fetch class analytics widgets successfully', async () => {
    const widgets = [
      {
        key: 'class_average_score',
        title: 'Class Average Score',
        formattedValue: '100.0%',
      },
    ];
    getClassAnalyticsWidgets.mockResolvedValue({
      data: {
        widgets,
      },
    });

    await fetchClassAnalyticsWidgets({
      institutionId: 2,
      classId: 'ccx-v1:PX+CS00002+2023+ccx@39',
    })(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, fetchClassAnalyticsWidgetsRequest());
    expect(getClassAnalyticsWidgets).toHaveBeenCalledWith({
      institutionId: 2,
      classId: 'ccx-v1:PX+CS00002+2023+ccx@39',
    });
    expect(camelCaseObject).toHaveBeenCalledWith({ data: { widgets } });
    expect(dispatch).toHaveBeenNthCalledWith(2, fetchClassAnalyticsWidgetsSuccess(widgets));
  });

  test('Should dispatch failed action and log error when API fails', async () => {
    const error = new Error('Request failed');
    getClassAnalyticsWidgets.mockRejectedValue(error);

    await fetchClassAnalyticsWidgets({
      institutionId: 2,
      classId: 'ccx-v1:PX+CS00002+2023+ccx@39',
    })(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, fetchClassAnalyticsWidgetsRequest());
    expect(dispatch).toHaveBeenNthCalledWith(2, fetchClassAnalyticsWidgetsFailed());
    expect(logError).toHaveBeenCalledWith(error);
  });
});
