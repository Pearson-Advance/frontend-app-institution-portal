import React, { useState, useMemo } from 'react';
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
import { handleEnrollments, getMessages } from 'features/Students/data/api';
import { fetchAllClassesData } from 'features/Classes/data/thunks';
import { initialPage } from 'features/constants';

import 'features/Classes/EnrollStudent/index.scss';

const EnrollStudent = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const { courseId, classId } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const institution = useSelector((state) => state.main.selectedInstitution);
  const courseIdDecoded = decodeURIComponent(courseId);
  const classIdDecoded = decodeURIComponent(classId);

  const defaultClassInfo = useMemo(() => ({
    className: '',
  }), []);

  const classInfo = useSelector((state) => state.classes.allClasses.data)
    .find((classElement) => classElement?.classId === classIdDecoded) || defaultClassInfo;

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const { studentEmail } = Object.fromEntries(formData.entries());

    formData.delete('studentEmail');
    formData.append('identifiers', studentEmail);
    formData.append('action', 'enroll');
    formData.append('auto_enroll', 'true');
    formData.append('email_students', 'true');

    try {
      setLoading(true);
      const response = await handleEnrollments(formData, classIdDecoded);
      const validationEmailList = response?.data?.results;
      const messages = await getMessages();
      const validEmails = [];
      const invalidEmails = [];
      let textToast = '';

      /**
       * This is because the service that checks the enrollment status is a different
       * endpoint, and that endpoint always returns a status 200, so the error cannot be
       * caught with a .catch.
       */
      if (messages?.data?.results[0]?.tags === 'error') {
        setToastMessage(decodeURIComponent(messages?.data?.results[0]?.message));
        setShowToast(true);

        return onClose();
      }

      validationEmailList.forEach(({ invalidIdentifier, identifier }) => {
        (invalidIdentifier ? invalidEmails : validEmails).push(identifier);
      });

      if (invalidEmails.length > 0) {
        textToast = `The following email ${invalidEmails.length === 1
          ? 'adress is invalid'
          : 'adresses are invalid'}:\n${invalidEmails.join('\n')}\n`;
      }
      if (validEmails.length > 0) {
        textToast += `Successfully enrolled and sent email to the following ${validEmails.length === 1
          ? 'user'
          : 'users'}:\n${validEmails.join('\n')}`;
      }

      setToastMessage(textToast);

      const params = {
        course_id: courseIdDecoded,
        class_id: classIdDecoded,
        limit: true,
      };

      dispatch(fetchStudentsData(institution.id, initialPage, params));

      // Get the classes info updated with the new number of students enrolled.
      dispatch(fetchAllClassesData(institution.id, courseIdDecoded));

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
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        className="toast-message"
        data-testid="toast-message"
      >
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
            Class: {classInfo.className}
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
                  as="textarea"
                  placeholder="Enter email of the student to enroll"
                  floatingLabel="Email"
                  className="my-4 mr-0 student-email"
                  name="studentEmail"
                  required
                  autoResize
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
