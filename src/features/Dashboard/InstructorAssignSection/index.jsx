import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Row, Col } from '@edx/paragon';
import ClassCard from 'features/Dashboard/InstructorAssignSection/ClassCard';
import { Button } from 'react-paragon-topaz';

import { fetchClassesData } from 'features/Dashboard/data';
import { updateActiveTab } from 'features/Main/data/slice';

import 'features/Dashboard/InstructorAssignSection/index.scss';

const InstructorAssignSection = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const classesData = useSelector((state) => state.dashboard.classesNoInstructors.data);
  const [classCards, setClassCards] = useState([]);
  const numberOfClasses = 2;

  const handleViewAllClasses = () => {
    history.push('/classes?instructors=null');
    dispatch(updateActiveTab('classes'));
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchClassesData(selectedInstitution?.id, false));
    }
  }, [selectedInstitution, dispatch]);

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
        {classCards.map(classInfo => <ClassCard data={classInfo} key={classInfo?.classId} />)}
        {classesData.length > numberOfClasses && (
          <div className="d-flex justify-content-center">
            <Button text className="view-all-btn" onClick={handleViewAllClasses}>View all</Button>
          </div>
        )}
        {classesData.length === 0 && (
          <div className="empty-content">No classes found</div>
        )}
      </Col>
    </Row>
  );
};

export default InstructorAssignSection;
