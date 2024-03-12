import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  ModalDialog,
  Spinner,
  Toast,
  ModalCloseButton,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import { Button } from 'react-paragon-topaz';
import { useParams } from 'react-router-dom';

import { handleEnrollments } from 'features/Students/data/api';

import 'features/Classes/EnrollStudent/index.scss';
import { logError } from '@edx/frontend-platform/logging';

const initialRequestState = {
  isLoading: false,
  isSuccessful: false,
};

const successToastMessage = 'Email invite has been sent successfully';

const EnrollStudent = ({ isOpen, onClose }) => {
  const { classId } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [requestStatus, setRequestStatus] = useState(initialRequestState);

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const { studentEmail } = Object.fromEntries(formData.entries());

    formData.delete('studentEmail');
    formData.append('identifiers', studentEmail);
    formData.append('action', 'enroll');

    try {
      setRequestStatus({
        isLoading: true,
        isSuccessful: false,
      });

      await handleEnrollments(formData, encodeURIComponent(classId));

      setRequestStatus({
        isLoading: false,
        isSuccessful: true,
      });
      setShowToast(true);
      onClose();
    } catch (error) {
      logError(error);
      setRequestStatus(initialRequestState);
    }
  };

  return (
    <>
      <Toast onClose={() => setShowToast(false)} show={showToast}>
        {successToastMessage}
      </Toast>

      <ModalDialog
        title="Invite student to enroll"
        isOpen={isOpen}
        onClose={onClose}
        hasCloseButton
      >
        <ModalDialog.Header>
          <ModalDialog.Title>Invite student to enroll</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body className="body-container h-100">
          <p className="text-uppercase font-weight-bold sub-title">
            Class: {classId}
          </p>
          {requestStatus.isLoading && (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          )}

          {!requestStatus.isLoading && (
            <Form onSubmit={handleEnrollStudent}>
              <FormGroup controlId="studentInfo">
                <Form.Control
                  type="email"
                  placeholder="Enter email of the student to enroll"
                  floatingLabel="Email"
                  className="my-4 mr-0"
                  name="studentEmail"
                  required
                />
              </FormGroup>
              <div className="d-flex justify-content-end">
                <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2">
                  Cancel
                </ModalCloseButton>
                <Button type="submit">Send invite</Button>
              </div>
            </Form>
          )}
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

EnrollStudent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EnrollStudent;
