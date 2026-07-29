import { render } from '@testing-library/react';

import MetricCard from 'features/Common/MetricCard';

describe('MetricCard', () => {
  test('renders title and value', () => {
    const { getByText } = render(
      <MetricCard title="Class Average Score" value="100.0%" />,
    );

    expect(getByText('Class Average Score')).toBeInTheDocument();
    expect(getByText('100.0%')).toBeInTheDocument();
  });

  test('renders dash when value is missing', () => {
    const { getByText } = render(
      <MetricCard title="Class Average Score" value={null} />,
    );

    expect(getByText('-')).toBeInTheDocument();
  });

  test('renders an optional subtitle', () => {
    const { getByText } = render(
      <MetricCard
        title="Pass/Fail Rate"
        value="88%"
        subtitle="7 passed, 1 failed"
      />,
    );

    expect(getByText('Pass/Fail Rate')).toBeInTheDocument();
    expect(getByText('88%')).toBeInTheDocument();
    expect(getByText('7 passed, 1 failed')).toBeInTheDocument();
  });

  test('preserves a numeric zero value', () => {
    const { getByText } = render(
      <MetricCard title="Pass/Fail Rate" value={0} />,
    );

    expect(getByText('0')).toBeInTheDocument();
  });

  test('renders trend and up icon when trend direction is up', () => {
    const { container, getByText } = render(
      <MetricCard
        title="Class Average Score"
        value="83.0%"
        trend="+2%"
        trendDirection="up"
      />,
    );

    expect(getByText('+2%')).toBeInTheDocument();
    expect(container.querySelector('.metric-card__trend--up')).toBeInTheDocument();
    expect(container.querySelector('.fa-arrow-trend-up')).toBeInTheDocument();
  });

  test('renders trend and down icon when trend direction is down', () => {
    const { container, getByText } = render(
      <MetricCard
        title="Class Average Score"
        value="83.0%"
        trend="-2%"
        trendDirection="down"
      />,
    );

    expect(getByText('-2%')).toBeInTheDocument();
    expect(container.querySelector('.metric-card__trend--down')).toBeInTheDocument();
    expect(container.querySelector('.fa-arrow-trend-down')).toBeInTheDocument();
  });

  test('renders info icon by default', () => {
    const { container } = render(
      <MetricCard title="Class Average Score" value="100.0%" />,
    );

    expect(container.querySelector('.metric-card__info-icon')).toBeInTheDocument();
  });

  test('does not render info icon when disabled', () => {
    const { container } = render(
      <MetricCard title="Class Average Score" value="100.0%" showInfoIcon={false} />,
    );

    expect(container.querySelector('.metric-card__info-icon')).not.toBeInTheDocument();
  });

  test('renders loading state', () => {
    const { container, queryByText } = render(
      <MetricCard title="Class Average Score" isLoading />,
    );

    expect(container.querySelector('.metric-card--loading')).toBeInTheDocument();
    expect(container.querySelector('.metric-card__skeleton--title')).toBeInTheDocument();
    expect(container.querySelector('.metric-card__skeleton--value')).toBeInTheDocument();
    expect(queryByText('Class Average Score')).not.toBeInTheDocument();
  });

  test('adds error class when hasError is true', () => {
    const { container } = render(
      <MetricCard title="Class Average Score" value="-" hasError />,
    );

    expect(container.querySelector('.metric-card--error')).toBeInTheDocument();
  });
});
