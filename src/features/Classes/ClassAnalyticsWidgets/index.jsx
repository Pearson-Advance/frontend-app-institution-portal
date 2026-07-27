import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-paragon-topaz';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import MetricCard from 'features/Common/MetricCard';
import { RequestStatus } from 'features/constants';
import {
  fetchClassAnalyticsWidgets,
} from 'features/Classes/data';
import {
  resetClassAnalyticsWidgets,
} from 'features/Classes/data/slice';

import 'features/Classes/ClassAnalyticsWidgets/index.scss';

const isConfigEnabled = (value) => value === true || value === 'true';

const ClassAnalyticsWidgets = ({ classId }) => {
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const analyticsWidgets = useSelector((state) => state.classes.classAnalyticsWidgets);

  const isEnabled = isConfigEnabled(getConfig().ENABLE_CLASS_ANALYTICS_WIDGETS)
    || isConfigEnabled(getConfig().PSS_ENABLE_CLASS_ANALYTICS_WIDGETS);

  const isLoading = analyticsWidgets?.status === RequestStatus.LOADING;
  const widgets = analyticsWidgets?.data || [];

  useEffect(() => {
    if (!isEnabled || !institution?.id || !classId) {
      return undefined;
    }

    dispatch(fetchClassAnalyticsWidgets({
      institutionId: institution.id,
      classId,
    }));

    return () => dispatch(resetClassAnalyticsWidgets());
  }, [dispatch, isEnabled, institution?.id, classId]);

  if (!isEnabled) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="class-analytics-overview" aria-label="Class overview">
        <div className="class-analytics-overview__header">
          <h4 className="class-analytics-overview__title">Class overview</h4>
        </div>
        <div className="class-analytics-overview__cards">
          <MetricCard title="Class Average Score" isLoading />
        </div>
      </section>
    );
  }

  if (!widgets.length) {
    return null;
  }

  return (
    <section className="class-analytics-overview" aria-label="Class overview">
      <div className="class-analytics-overview__header">
        <h4 className="class-analytics-overview__title">Class overview</h4>

        {isConfigEnabled(getConfig().PSS_ENABLE_CLASS_INSIGHTS_BUTTON) && (
          <Button
            variant="outline-primary"
            className="class-analytics-overview__button"
          >
            View class insights
          </Button>
        )}
      </div>

      <div className="class-analytics-overview__cards">
        {widgets.map((widget) => (
          <MetricCard
            key={widget.key}
            title={widget.title}
            value={widget.formattedValue || widget.formatted_value}
            subtitle={widget.subtitle}
            trend={widget.formattedTrend || widget.formatted_trend}
            trendDirection={widget.trendDirection || widget.trend_direction}
            hasError={widget.error}
          />
        ))}
      </div>
    </section>
  );
};

ClassAnalyticsWidgets.propTypes = {
  classId: PropTypes.string.isRequired,
};

export default ClassAnalyticsWidgets;
