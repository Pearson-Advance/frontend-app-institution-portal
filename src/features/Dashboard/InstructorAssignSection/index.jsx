import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Row, Col } from '@edx/paragon';
import ClassCard from 'features/Dashboard/InstructorAssignSection/ClassCard';
import { Button } from 'react-paragon-topaz';

import { fetchClassesData } from 'features/Dashboard/data';

import 'features/Dashboard/InstructorAssignSection/index.scss';

const InstructorAssignSection = () => {
  const dispatch = useDispatch();
  const stateInstitution = useSelector((state) => state.main.institution.data);
  const classesData = useSelector((state) => state.dashboard.classes.data);
  const [classCards, setClassCards] = useState([]);
  let idInstitution = '';
  const numberOfClasses = 2;
  // eslint-disable-next-line no-unused-expressions
  stateInstitution.length > 0 ? idInstitution = stateInstitution[0].id : idInstitution = '';

  useEffect(() => {
    dispatch(fetchClassesData(idInstitution));
  }, [idInstitution]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Display only the first 'NumberOfClasses' on the homepage.
    if (classesData.length > numberOfClasses) {
      setClassCards(classesData.slice(0, numberOfClasses));
    } else {
      setClassCards(classesData);
    }
  }, [classesData]);

  return (
    <Row>
      <Col xs="12">
        <h4 className="title-instr-assign">Instructor assignment</h4>
        {classCards.map(classInfo => <ClassCard data={classInfo} />)}
        {classesData.length > numberOfClasses && (
          <div className="d-flex justify-content-center">
            <Button text className="view-all-btn">View all</Button>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default InstructorAssignSection;
