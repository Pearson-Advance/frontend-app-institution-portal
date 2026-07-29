import React from 'react';
import PropTypes from 'prop-types';

import 'features/Common/MetricCard/index.scss';

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  isLoading,
  hasError,
  showInfoIcon,
}) => {
  if (isLoading) {
    return (
      <article className="metric-card metric-card--loading">
        <div className="metric-card__skeleton metric-card__skeleton--title" />
        <div className="metric-card__skeleton metric-card__skeleton--value" />
      </article>
    );
  }

  return (
    <article className={`metric-card ${hasError ? 'metric-card--error' : ''}`}>
      <h5 className="metric-card__title">
        {title}
      </h5>

      <div className="metric-card__value">
        {value ?? '-'}
      </div>

      <div className="metric-card__footer">
        <div className="metric-card__footer-content">
          {subtitle && (
            <span className="metric-card__subtitle">
              {subtitle}
            </span>
          )}

          {trend && (
            <span className={`metric-card__trend metric-card__trend--${trendDirection}`}>
              {trend}
              {trendDirection === 'up' && (
                <i className="fa-solid fa-arrow-trend-up ml-2" aria-hidden="true" />
              )}
              {trendDirection === 'down' && (
                <i className="fa-solid fa-arrow-trend-down ml-2" aria-hidden="true" />
              )}
            </span>
          )}
        </div>

        {showInfoIcon && (
          <i className="fa-regular fa-circle-info metric-card__info-icon" aria-hidden="true" />
        )}
      </div>
    </article>
  );
};

MetricCard.propTypes = {
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  showInfoIcon: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  trend: PropTypes.string,
  trendDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MetricCard.defaultProps = {
  hasError: false,
  isLoading: false,
  showInfoIcon: true,
  subtitle: null,
  trend: null,
  trendDirection: 'neutral',
  value: '-',
};

export default MetricCard;
