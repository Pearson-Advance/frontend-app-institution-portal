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
import {
  parseIdentifiers,
  isEnrollmentSuccessful,
  mergeEnrollmentResults,
  groupEnrollmentResults,
  extractApiErrorMessage,
} from 'features/Sessions/data/utils';

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

  const groupedFeedback = useMemo(
    () => groupEnrollmentResults(enrollmentResults),
    [enrollmentResults],
  );

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const identifiers = parseIdentifiers(identifiersText);

    if (identifiers.length === 0) { return; }

    try {
      const response = await enrollStudentInSession({
        offeringRunId: sessionId,
        data: { identifiers: identifiers.join(', ') },
      }).unwrap();

      const results = response?.results || [];
      const unsuccessful = results.filter((item) => !isEnrollmentSuccessful(item.status));

      if (unsuccessful.length > 0) {
        setEnrollmentResults((previous) => mergeEnrollmentResults(previous, results));
        setIdentifiersText(
          unsuccessful.map((item) => item.identifier).join(', '),
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
                disabled={isLoading}
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
                disabled={isLoading}
              >
                Cancel
              </ModalCloseButton>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Spinner
                    animation="border"
                    size="sm"
                    className="mr-2"
                    screenReaderText="loading"
                    data-testid="enroll-submit-spinner"
                  />
                )}
                {hasFailedAttempt ? 'Retry' : 'Send invite'}
              </Button>
            </div>
          </Form>
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
