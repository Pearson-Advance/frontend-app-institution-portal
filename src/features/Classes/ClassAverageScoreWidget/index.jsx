import React, { useMemo } from 'react';
import { getConfig } from '@edx/frontend-platform';

import 'features/Classes/ClassAverageScoreWidget/index.scss';

function isConfigEnabled(value) {
  return value === true || value === 'true';
}

function buildSupersetWidgetUrl(rawUrl) {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);

    if (!url.searchParams.has('standalone')) {
      url.searchParams.set('standalone', '1');
    }

    return url.toString();
  } catch {
    return null;
  }
}

const ClassAverageScoreWidget = () => {
  const widgetUrl = useMemo(() => {
    const {
      ENABLE_SUPERSET_CLASS_AVERAGE_SCORE_WIDGET,
      SUPERSET_CLASS_AVERAGE_SCORE_WIDGET_URL,
    } = getConfig();

    if (!isConfigEnabled(ENABLE_SUPERSET_CLASS_AVERAGE_SCORE_WIDGET)) {
      return null;
    }

    return buildSupersetWidgetUrl(SUPERSET_CLASS_AVERAGE_SCORE_WIDGET_URL);
  }, []);

  if (!widgetUrl) {
    return null;
  }

  return (
    <article className="class-average-score-widget">
      <iframe
        title="Class Average Score"
        src={widgetUrl}
        className="class-average-score-widget__frame"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </article>
  );
};

export default ClassAverageScoreWidget;
