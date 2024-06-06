import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Container, Spinner, Row, useToggle, Toast,
} from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { Button } from 'react-paragon-topaz';

import DeleteModal from 'features/Common/DeleteModal';

import { assignInstructors, fetchInstructorsOptionsData } from 'features/Instructors/data';
import { RequestStatus, initialPage } from 'features/constants';

const ListInstructors = ({ instructors, isLoadingInstructors }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const institution = useSelector((state) => state.main.selectedInstitution);
  const statusAssignRequest = useSelector((state) => state.instructors.assignInstructors.status);

  const queryParams = new URLSearchParams(location.search);
  const classId = queryParams.get('classId')?.replaceAll(' ', '+');

  const [isOpenModal, openModal, closeModal] = useToggle(false);
  const [instructorName, setInstructorName] = useState('');
  const [instructorUsername, setInstructorUsername] = useState('');
  const [showToast, setShowToast] = useState(false);

  const isLoadingAssign = statusAssignRequest === RequestStatus.LOADING;
  const toastMessageFailed = 'Something went wrong and we could not complete your request';

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
      setShowToast(true);
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
      >
        {toastMessageFailed}
      </Toast>
      <Container size="xl" className="p-4 mt-3 instructors-content">
        <DeleteModal
          isOpen={isOpenModal}
          onClose={closeModal}
          handleDelete={handleDeleteInstructor}
          title="Remove instructor"
          textModal={`Are you sure you want to remove ${instructorName} from the list of assigned instructors?`}
          labelDeleteButton="Remove"
          isLoading={isLoadingAssign}
        />
        <Row className="justify-content-center my-4 my-3 px-3">
          <h3 className="pb-2 col-12 px-0">Currently assigned instructors</h3>
          {isLoadingInstructors && (
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
                <p className="list-item d-flex justify-content-between align-items-baseline" key={instructor.instructorUsername}>
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
          {instructors && instructors.length === 0 && !isLoadingInstructors && (
            <p className="empty-list m-0 py-2 px-0 col-12">No records found.</p>
          )}
        </Row>
      </Container>
    </>

  );
};

ListInstructors.propTypes = {
  instructors: PropTypes.arrayOf(PropTypes.shape([])),
  isLoadingInstructors: PropTypes.bool,
};

ListInstructors.defaultProps = {
  instructors: [],
  isLoadingInstructors: false,
};

export default ListInstructors;
