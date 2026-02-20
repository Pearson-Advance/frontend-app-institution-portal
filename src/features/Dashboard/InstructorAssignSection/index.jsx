import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Row, Col, Spinner } from '@edx/paragon';
import ClassCard from 'features/Dashboard/InstructorAssignSection/ClassCard';
import { Button } from 'react-paragon-topaz';

import { fetchClassesData } from 'features/Dashboard/data';
import { updateActiveTab } from 'features/Main/data/slice';

import { useInstitutionIdQueryParam } from 'hooks';
import { RequestStatus } from 'features/constants';

import 'features/Dashboard/InstructorAssignSection/index.scss';

const InstructorAssignSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const classesInfo = useSelector((state) => state.dashboard.classesNoInstructors);
  const classesData = classesInfo.data;
  const isLoadingClasses = classesInfo.status === RequestStatus.LOADING;
  const [classCards, setClassCards] = useState([]);
  const numberOfClasses = 2;

  const addQueryParam = useInstitutionIdQueryParam();

  const handleViewAllClasses = () => {
    navigate(addQueryParam('/classes?instructors=null'));
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
        {isLoadingClasses && (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner
            animation="border"
            className="mie-3"
            screenReaderText="loading"
          />
        </div>
        )}
        {!isLoadingClasses && classCards.map(classInfo => <ClassCard data={classInfo} key={classInfo?.classId} />)}
        {!isLoadingClasses && classesData.length > numberOfClasses && (
          <div className="d-flex justify-content-center">
            <Button text className="view-all-btn" onClick={handleViewAllClasses}>View all</Button>
          </div>
        )}
        {!isLoadingClasses && classesData.length === 0 && (
          <div className="empty-content">No classes found</div>
        )}
      </Col>
    </Row>
  );
};

export default InstructorAssignSection;
