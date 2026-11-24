import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Toast,
  Spinner,
  FormGroup,
  ModalDialog,
  ModalCloseButton,
} from '@openedx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { useEnrollStudentInSessionMutation } from 'features/Sessions/data/sessionsApi';

import 'features/Classes/EnrollStudent/index.scss';

const EnrollStudentModal = ({
  isOpen,
  onClose,
  sessionId,
  sessionName,
}) => {
  const [identifiersText, setIdentifiersText] = useState('');
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);
  const [enrollmentResults, setEnrollmentResults] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [enrollStudentInSession, { isLoading }] = useEnrollStudentInSessionMutation();

  useEffect(() => {
    if (!isOpen) {
      setIdentifiersText('');
      setHasFailedAttempt(false);
      setEnrollmentResults([]);
    }
  }, [isOpen]);

  const groupedFeedback = useMemo(() => {
    if (enrollmentResults.length === 0) {
      return { completed: [], errorGroups: [] };
    }

    const completed = [];
    const errorsMap = new Map();

    enrollmentResults.forEach((item) => {
      if (item.status === 'completed') {
        completed.push(item.identifier);
      } else {
        const errorReason = item.error || `Enrollment ${item.status}.`;
        const currentList = errorsMap.get(errorReason) || [];
        currentList.push(item.identifier);
        errorsMap.set(errorReason, currentList);
      }
    });

    const errorGroups = Array.from(errorsMap.entries()).map(([error, identifiers]) => ({
      error,
      identifiers,
    }));

    return { completed, errorGroups };
  }, [enrollmentResults]);

  const extractApiErrorMessage = (error) => {
    const errorData = error?.data;

    if (typeof errorData === 'string') { return errorData; }
    if (errorData && typeof errorData === 'object') {
      if (errorData.detail) { return errorData.detail; }
      if (errorData.message) { return errorData.message; }
      if (Array.isArray(errorData.non_field_errors)) {
        return errorData.non_field_errors.join(' ');
      }

      const fieldErrors = Object.entries(errorData)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .join('\n');

      if (fieldErrors) { return fieldErrors; }
    }

    return error?.message || 'An error occurred while attempting to enroll the student.';
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const cleanedIdentifiers = identifiersText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ');

    if (!cleanedIdentifiers) { return; }

    try {
      const response = await enrollStudentInSession({
        offeringRunId: sessionId,
        data: { identifiers: cleanedIdentifiers },
      }).unwrap();

      const results = response?.results || [];
      const failedOrRejected = results.filter(
        (item) => item.status === 'failed' || item.status === 'rejected',
      );

      if (failedOrRejected.length > 0) {
        setEnrollmentResults(results);
        setIdentifiersText(
          failedOrRejected.map((item) => item.identifier).join(', '),
        );
        setHasFailedAttempt(true);
        return;
      }

      const enrolledList = results.map((item) => item.identifier).join(', ');
      setEnrollmentResults([]);
      setHasFailedAttempt(false);
      setIdentifiersText('');
      setToastMessage(
        enrolledList
          ? `Successfully enrolled: ${enrolledList}.`
          : 'Successfully enrolled student(s) in the session.',
      );
      setShowToast(true);
      onClose();
    } catch (error) {
      logError(error);
      setHasFailedAttempt(true);
      setToastMessage(extractApiErrorMessage(error));
      setShowToast(true);
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
        isOverflowVisible={false}
        hasCloseButton
      >
        <ModalDialog.Header>
          <ModalDialog.Title>Invite student to enroll</ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body className="body-container h-100">
          <p className="text-uppercase font-weight-bold sub-title">
            Session: {sessionName}
          </p>

          {isLoading ? (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center my-4">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          ) : (
            <Form onSubmit={handleEnrollStudent}>
              <FormGroup controlId="studentInfo" className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder="Enter email or username of the student to enroll"
                  floatingLabel="Email or username"
                  className="mt-4 mb-2 mr-0 student-email"
                  name="studentEmail"
                  value={identifiersText}
                  onChange={(e) => setIdentifiersText(e.target.value)}
                  required
                  autoResize
                />

                {enrollmentResults.length > 0 && (
                  <div
                    className="mt-2 small"
                    style={{ maxHeight: '150px', overflowY: 'auto' }}
                    data-testid="enrollment-results-feedback"
                  >
                    {groupedFeedback.completed.length > 0 && (
                      <div className="mb-2 text-success">
                        <strong>
                          Successfully enrolled ({groupedFeedback.completed.length}):
                        </strong>{' '}
                        {groupedFeedback.completed.join(', ')}
                      </div>
                    )}

                    {groupedFeedback.errorGroups.map(({ error, identifiers }) => (
                      <div key={error} className="mb-2 text-danger">
                        <strong>
                          {error} ({identifiers.length}):
                        </strong>{' '}
                        {identifiers.join(', ')}
                      </div>
                    ))}
                  </div>
                )}
              </FormGroup>

              <div className="d-flex justify-content-end mt-3">
                <ModalCloseButton
                  className="btntpz btn-text btn-tertiary mr-2"
                  onClick={onClose}
                >
                  Cancel
                </ModalCloseButton>
                <Button type="submit">
                  {hasFailedAttempt ? 'Retry' : 'Send invite'}
                </Button>
              </div>
            </Form>
          )}
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

EnrollStudentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sessionName: PropTypes.string,
};

EnrollStudentModal.defaultProps = {
  sessionName: '',
};

export default EnrollStudentModal;
