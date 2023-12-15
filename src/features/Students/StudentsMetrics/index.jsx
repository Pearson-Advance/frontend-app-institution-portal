import React, { useEffect, useReducer } from 'react';
import { Card, CardGrid, ToggleButton } from '@edx/paragon';
import { ToggleButtonGroup } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { getMetricsStudents } from 'features/Students/data/api';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Students/StudentsMetrics/reducer';
import {
  FETCH_METRICS_DATA_REQUEST,
  FETCH_METRICS_DATA_SUCCESS,
  FETCH_METRICS_DATA_FAILURE,
} from 'features/Students/actionTypes';
import 'features/Students/StudentsMetrics/index.scss';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
};

const StudentsMetrics = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchMetricsData = async () => {
    dispatch({ type: FETCH_METRICS_DATA_REQUEST });

    try {
      const response = camelCaseObject(await getMetricsStudents());
      dispatch({ type: FETCH_METRICS_DATA_SUCCESS, payload: response });
    } catch (error) {
      dispatch({ type: FETCH_METRICS_DATA_FAILURE, payload: error });
      logError(error);
    }
  };

  useEffect(() => {
    fetchMetricsData();
  }, []);

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
            <div className="card-number">{state.data.newStudentsRegistered}</div>
          </Card.Section>
        </Card>
        <Card className="card-green">
          <Card.Header
            title="Classes scheduled"
          />
          <Card.Section>
            <div className="card-number">{state.data.classesScheduled}</div>
          </Card.Section>
        </Card>
      </CardGrid>
    </div>
  );
};

export default StudentsMetrics;
