import { waitFor } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import { getConfig } from '@edx/frontend-platform';

import ClassAnalyticsWidgets from 'features/Classes/ClassAnalyticsWidgets';
import { getClassAnalyticsWidgets } from 'features/Classes/data/api';
import { RequestStatus } from 'features/constants';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
  camelCaseObject: jest.fn((value) => ({
    data: {
      widgets: value?.data?.widgets?.map((widget) => ({
        ...widget,
        formattedValue: widget.formatted_value,
        formattedTrend: widget.formatted_trend,
        trendDirection: widget.trend_direction,
      })) || [],
    },
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Classes/data/api', () => ({
  getClassAnalyticsWidgets: jest.fn(),
  handleSkillableDashboard: jest.fn(),
  handleXtremeLabsDashboard: jest.fn(),
}));

const classId = 'ccx-v1:PX+CS00002+2023+ccx@39';

const baseState = {
  main: {
    selectedInstitution: {
      id: 2,
    },
  },
  classes: {
    classAnalyticsWidgets: {
      data: [],
      status: RequestStatus.INITIAL,
      error: null,
    },
  },
};

const renderComponent = ({
  state = baseState,
  componentClassId = classId,
  config = { ENABLE_CLASS_ANALYTICS_WIDGETS: true },
} = {}) => {
  getConfig.mockReturnValue(config);

  return renderWithProviders(
    <ClassAnalyticsWidgets classId={componentClassId} />,
    { preloadedState: state },
  );
};

describe('ClassAnalyticsWidgets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render or request widgets when feature flag is disabled', () => {
    const { queryByLabelText } = renderComponent({
      config: {
        ENABLE_CLASS_ANALYTICS_WIDGETS: false,
        PSS_ENABLE_CLASS_ANALYTICS_WIDGETS: false,
      },
    });

    expect(queryByLabelText('Class overview')).not.toBeInTheDocument();
    expect(getClassAnalyticsWidgets).not.toHaveBeenCalled();
  });

  test('uses PSS-prefixed feature flag as fallback', async () => {
    getClassAnalyticsWidgets.mockResolvedValue({
      data: {
        widgets: [
          {
            key: 'class_average_score',
            title: 'Class Average Score',
            formatted_value: '100.0%',
          },
        ],
      },
    });

    const { getByText } = renderComponent({
      config: {
        ENABLE_CLASS_ANALYTICS_WIDGETS: false,
        PSS_ENABLE_CLASS_ANALYTICS_WIDGETS: true,
      },
    });

    await waitFor(() => expect(getByText('Class overview')).toBeInTheDocument());
    expect(getByText('100.0%')).toBeInTheDocument();
    expect(getClassAnalyticsWidgets).toHaveBeenCalledWith({
      institutionId: 2,
      classId,
    });
  });

  test('fetches and renders widgets when enabled', async () => {
    getClassAnalyticsWidgets.mockResolvedValue({
      data: {
        widgets: [
          {
            key: 'class_average_score',
            title: 'Class Average Score',
            formatted_value: '100.0%',
            formatted_trend: '+2%',
            trend_direction: 'up',
          },
          {
            key: 'pass_fail_rate',
            title: 'Pass/Fail Rate',
            formatted_value: '88%',
            subtitle: '7 passed, 1 failed',
          },
        ],
      },
    });

    const { getByText } = renderComponent();

    await waitFor(() => expect(getByText('Class overview')).toBeInTheDocument());
    expect(getByText('Class Average Score')).toBeInTheDocument();
    expect(getByText('100.0%')).toBeInTheDocument();
    expect(getByText('+2%')).toBeInTheDocument();
    expect(getByText('Pass/Fail Rate')).toBeInTheDocument();
    expect(getByText('88%')).toBeInTheDocument();
    expect(getByText('7 passed, 1 failed')).toBeInTheDocument();
    expect(getClassAnalyticsWidgets).toHaveBeenCalledWith({
      institutionId: 2,
      classId,
    });
  });

  test('renders loading state while request is pending', () => {
    getClassAnalyticsWidgets.mockReturnValue(new Promise(() => {}));

    const { container, getByText } = renderComponent();

    expect(getByText('Class overview')).toBeInTheDocument();
    expect(container.querySelector('.metric-card--loading')).toBeInTheDocument();
  });

  test('does not render overview when request succeeds with no widgets', async () => {
    getClassAnalyticsWidgets.mockResolvedValue({ data: { widgets: [] } });

    const { queryByText } = renderComponent();

    await waitFor(() => expect(getClassAnalyticsWidgets).toHaveBeenCalled());
    expect(queryByText('Class overview')).not.toBeInTheDocument();
  });

  test('does not request widgets without institution id', () => {
    renderComponent({
      state: {
        ...baseState,
        main: {
          selectedInstitution: {},
        },
      },
    });

    expect(getClassAnalyticsWidgets).not.toHaveBeenCalled();
  });

  test('does not request widgets without class id', () => {
    renderComponent({ componentClassId: '' });

    expect(getClassAnalyticsWidgets).not.toHaveBeenCalled();
  });

  test('renders class insights button when enabled', async () => {
    getClassAnalyticsWidgets.mockResolvedValue({
      data: {
        widgets: [
          {
            key: 'class_average_score',
            title: 'Class Average Score',
            formatted_value: '100.0%',
          },
        ],
      },
    });

    const { getByText } = renderComponent({
      config: {
        ENABLE_CLASS_ANALYTICS_WIDGETS: true,
        PSS_ENABLE_CLASS_INSIGHTS_BUTTON: true,
      },
    });

    await waitFor(() => expect(getByText('View class insights')).toBeInTheDocument());
  });
});
