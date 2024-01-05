import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardGrid, ToggleButton } from '@edx/paragon';
import { ToggleButtonGroup } from 'react-paragon-topaz';
import { fetchMetricsData } from 'features/Students/data/thunks';

import 'features/Students/StudentsMetrics/index.scss';

const StudentsMetrics = () => {
  const dispatch = useDispatch();
  const stateMetrics = useSelector((state) => state.students.metrics.data);

  useEffect(() => {
    dispatch(fetchMetricsData());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container-cards d-flex flex-column">
      <ToggleButtonGroup type="radio" defaultValue={1} name="period">
        <ToggleButton id="tbg-radio-1" value={1} variant="outline-primary">
          This week
        </ToggleButton>
        <ToggleButton id="tbg-radio-2" value={2} variant="outline-primary">
          Next week
        </ToggleButton>
        <ToggleButton id="tbg-radio-3" value={3} variant="outline-primary">
          Next month
        </ToggleButton>
      </ToggleButtonGroup>
      <CardGrid
        columnSizes={{
          xs: 12,
          xl: 6,
        }}
        className="w-100"
      >
        <Card className="card-pink">
          <Card.Header
            title="New students registered"
          />
          <Card.Section>
            <div className="card-number">{stateMetrics.newStudentsRegistered}</div>
          </Card.Section>
        </Card>
        <Card className="card-green">
          <Card.Header
            title="Classes scheduled"
          />
          <Card.Section>
            <div className="card-number">{stateMetrics.classesScheduled}</div>
          </Card.Section>
        </Card>
      </CardGrid>
    </div>
  );
};

export default StudentsMetrics;
