import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardGrid, ToggleButton } from '@openedx/paragon';
import { ToggleButtonGroup } from 'react-paragon-topaz';
import { fetchClassesMetricsData, fetchStudentsMetricsData } from 'features/Students/data/thunks';

import 'features/Students/StudentsMetrics/index.scss';

const StudentsMetrics = () => {
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const studentsMetrics = useSelector((state) => state.students.studentsMetrics.data);
  const classesMetrics = useSelector((state) => state.students.classesMetrics.data);
  const [periodDays, setPeriodDays] = useState(7);

  const handleChangePeriodDays = (val) => setPeriodDays(val);

  useEffect(() => {
    if (Object.keys(institution).length > 0) {
      dispatch(fetchStudentsMetricsData(institution.id, periodDays));
      dispatch(fetchClassesMetricsData(institution.id, periodDays));
    }
  }, [institution, dispatch, periodDays]);

  return (
    <div className="container-cards d-flex flex-column">
      <ToggleButtonGroup type="radio" defaultValue={7} name="period" onChange={handleChangePeriodDays}>
        <ToggleButton id="tbg-radio-1" value={7} variant="outline-primary">
          This week
        </ToggleButton>
        <ToggleButton id="tbg-radio-2" value={30} variant="outline-primary">
          Last month
        </ToggleButton>
        <ToggleButton id="tbg-radio-3" value={90} variant="outline-primary">
          Last quarter
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
