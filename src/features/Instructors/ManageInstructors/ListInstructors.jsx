import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Container, Spinner, Row, useToggle,
} from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { Button } from 'react-paragon-topaz';
import DeleteModal from 'features/Common/DeleteModal';

import { assignInstructors, fetchInstructorsOptionsData } from 'features/Instructors/data';
import { initialPage } from 'features/constants';

const ListInstructors = ({ instructors, isLoading }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const queryParams = new URLSearchParams(location.search);
  const classId = queryParams.get('classId')?.replaceAll(' ', '+');
  const [isOpenModal, openModal, closeModal] = useToggle(false);
  const [instructorName, setInstructorName] = useState('');
  const [instructorUsername, setInstructorUsername] = useState('');

  const handleDeleteIcon = (instructorInfo) => {
    setInstructorName(instructorInfo.instructorName);
    setInstructorUsername(instructorInfo.instructorUsername);
    openModal();
  };

  const handleDeleteInstructor = async () => {
    try {
      const instructorData = {
        unique_student_identifier: instructorUsername,
        rolename: 'staff',
        action: 'revoke',
        class_id: classId,
      };

      await dispatch(assignInstructors(instructorData));
      dispatch(fetchInstructorsOptionsData(institution.id, initialPage, { limit: false, class_id: classId }));
    } catch (error) {
      logError(error);
    } finally {
      closeModal();
    }
  };

  return (
    <Container size="xl" className="p-4 mt-3 instructors-content">
      <DeleteModal
        isOpen={isOpenModal}
        onClose={closeModal}
        handleDelete={handleDeleteInstructor}
        title="Remove instructor"
        textModal={`Are you sure you want to remove ${instructorName} from the list of assigned instructors?`}
        labelDeleteButton="Remove"
      />
      <Row className="justify-content-center my-4 my-3 px-3">
        <h3 className="pb-2 col-12 px-0">Currently assigned instructors</h3>
        {isLoading && (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner
              animation="border"
              className="mie-3"
              screenReaderText="loading"
            />
          </div>
        )}
        {instructors && instructors.length > 0 && (
          <div className="list-instructors col-12 px-0">
            {instructors.map(instructor => (
              <p className="list-item d-flex justify-content-between" key={instructor.instructorUsername}>
                {instructor.instructorName}
                <Button
                  onClick={() => handleDeleteIcon(instructor)}
                  className="delete-icon"
                  data-testid="delete-icon"
                  variant="tertiary"
                >
                  <i className="fa-regular fa-trash text-danger" />
                </Button>
              </p>
            ))}
          </div>
        )}
        {instructors && instructors.length === 0 && !isLoading && (
        <p className="empty-list m-0 py-2 px-0 col-12">No records found.</p>
        )}
      </Row>
    </Container>
  );
};

ListInstructors.propTypes = {
  instructors: PropTypes.arrayOf(PropTypes.shape([])),
  isLoading: PropTypes.bool,
};

ListInstructors.defaultProps = {
  instructors: [],
  isLoading: false,
};

export default ListInstructors;
