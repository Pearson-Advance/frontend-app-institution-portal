import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Form,
  Toast,
  Spinner,
  FormGroup,
  ModalDialog,
  ModalCloseButton,
} from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { fetchStudentsData } from 'features/Students/data';
import { handleEnrollments } from 'features/Students/data/api';
import { fetchAllClassesData } from 'features/Classes/data/thunks';
import { initialPage } from 'features/constants';

import 'features/Classes/EnrollStudent/index.scss';

const EnrollStudent = ({ isOpen, onClose, queryClassId }) => {
  const dispatch = useDispatch();

  const { courseName, className } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const institution = useSelector((state) => state.main.selectedInstitution);
  const courseNameDecoded = decodeURIComponent(courseName);
  const classNameDecoded = decodeURIComponent(className);

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const { studentEmail } = Object.fromEntries(formData.entries());

    formData.delete('studentEmail');
    formData.append('identifiers', studentEmail);
    formData.append('action', 'enroll');

    try {
      setLoading(true);
      const response = await handleEnrollments(formData, queryClassId);

      /**
       * This is because the service that checks the enrollment status is a different
       * endpoint, and that endpoint always returns a status 200, so the error cannot be
       * caught with a .catch.
       */
      if (response?.data?.results[0]?.tags === 'error') {
        setToastMessage(decodeURIComponent(response?.data?.results[0]?.message));
        setShowToast(true);

        return onClose();
      }

      setToastMessage('Email invite has been sent successfully');

      const params = {
        course_name: courseNameDecoded,
        class_name: classNameDecoded,
        limit: true,
      };

      dispatch(fetchStudentsData(institution.id, initialPage, params));

      // Get the classes info updated with the new number of students enrolled.
      dispatch(fetchAllClassesData(institution.id, courseNameDecoded));

      setShowToast(true);
      return onClose();
    } catch (error) {
      return logError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast onClose={() => setShowToast(false)} show={showToast}>
        {toastMessage}
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
            Class: {classNameDecoded}
          </p>
          {isLoading && (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          )}
          {!isLoading && (
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
  queryClassId: PropTypes.string.isRequired,
};

export default EnrollStudent;
