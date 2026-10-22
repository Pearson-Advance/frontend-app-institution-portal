import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { logError } from '@edx/frontend-platform/logging';
import EnrollModal from 'features/Common/EnrollModal';

import { handleEnrollments, getMessages } from 'features/Students/data/api';
import { studentsApi } from 'features/Students/data/studentsApi';
import { sessionsApi } from 'features/Sessions/data';

import 'features/Classes/EnrollStudent/index.scss';

const EnrollStudentModal = ({
  isOpen,
  onClose,
  sessionId,
  sessionName,
}) => {
  const dispatch = useDispatch();

  const [showToast, setShowToast] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const { studentEmail } = Object.fromEntries(formData.entries());

    formData.delete('studentEmail');
    formData.append('identifiers', studentEmail);
    formData.append('session_id', sessionId);
    formData.append('action', 'enroll');
    formData.append('auto_enroll', 'true');
    formData.append('email_students', 'true');

    try {
      setLoading(true);
      const response = await handleEnrollments(formData, sessionId);
      const validationEmailList = response?.data?.results || [];
      const messages = await getMessages();
      const validEmails = [];
      const invalidEmails = [];
      let textToast = '';

      /**
       * Checks for server error messages returned in status 200 responses
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
        textToast = `The following email ${
          invalidEmails.length === 1 ? 'address is invalid' : 'addresses are invalid'
        }:\n${invalidEmails.join('\n')}\n`;
      }

      if (validEmails.length > 0) {
        textToast += `Successfully enrolled and sent email to the following ${
          validEmails.length === 1 ? 'user' : 'users'
        }:\n${validEmails.join('\n')}`;
      }

      setToastMessage(textToast);

      dispatch(studentsApi.util.invalidateTags(['StudentsClass']));
      dispatch(sessionsApi.util.invalidateTags(['SessionsOptions']));

      setShowToast(true);
      return onClose();
    } catch (error) {
      logError(error);
      setToastMessage('An error occurred while attempting to enroll the student.');
      setShowToast(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnrollModal
      isOpen={isOpen}
      onClose={onClose}
      subtitleLabel="Session"
      subtitleValue={sessionName}
      onSubmit={handleEnrollStudent}
      isLoading={isLoading}
      showToast={showToast}
      setShowToast={setShowToast}
      toastMessage={toastMessage}
    />
  );
};

EnrollStudentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sessionId: PropTypes.string.isRequired,
  sessionName: PropTypes.string,
};

EnrollStudentModal.defaultProps = {
  sessionName: '',
};

export default EnrollStudentModal;
