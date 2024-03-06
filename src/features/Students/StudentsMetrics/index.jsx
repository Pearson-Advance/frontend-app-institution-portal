import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardGrid, ToggleButton } from '@edx/paragon';
import { ToggleButtonGroup } from 'react-paragon-topaz';
import { fetchClassesMetricsData, fetchStudentsMetricsData } from 'features/Students/data/thunks';
import { daysWeek } from 'features/constants';

import 'features/Students/StudentsMetrics/index.scss';

const StudentsMetrics = () => {
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const studentsMetrics = useSelector((state) => state.students.studentsMetrics.data);
  const classesMetrics = useSelector((state) => state.students.classesMetrics.data);

  useEffect(() => {
    if (Object.keys(institution).length > 0) {
      dispatch(fetchStudentsMetricsData(institution.id, daysWeek));
      dispatch(fetchClassesMetricsData(institution.id, daysWeek));
    }
  }, [institution, dispatch]);

  return (
    <div className="container-cards d-flex flex-column">
      <ToggleButtonGroup type="radio" defaultValue={1} name="period">
        <ToggleButton id="tbg-radio-1" value={1} variant="outline-primary">
          This week
        </ToggleButton>
        <ToggleButton id="tbg-radio-2" value={2} variant="outline-primary" disabled> {/* Temporarily disabled */}
          Next week
        </ToggleButton>
        <ToggleButton id="tbg-radio-3" value={3} variant="outline-primary" disabled> {/* Temporarily disabled */}
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
            <p className="card-number">
              {studentsMetrics.numberOfEnrollments ? studentsMetrics.numberOfEnrollments : '-'}
            </p>
          </Card.Section>
        </Card>
        <Card className="card-green">
          <Card.Header
            title="Classes scheduled"
          />
          <Card.Section>
            <p className="card-number">
              {classesMetrics.numberOfClassesCreated ? classesMetrics.numberOfClassesCreated : '-'}
            </p>
          </Card.Section>
        </Card>
      </CardGrid>
    </div>
  );
};

export default StudentsMetrics;
