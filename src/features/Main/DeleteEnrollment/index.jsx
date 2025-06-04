import { useState } from 'react';
import {
  Button,
  ModalDialog,
  ActionRow,
  Dropdown,
  Toast,
  useToggle,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchStudentsDataSuccess,
} from 'features/Students/data/slice';
import { deleteEnrollment } from 'features/Main/data/api';

const ERROR_MESSAGE = 'This student has reached a threshold of course activity that prevents unenrolled. If you wish to proceed, please contact support or your sales representative for assistance.';

/**
 * DeleteEnrollment allows an administrator to unenroll a student from a course.
 * It handles confirmation, API interaction, error display, and feedback toast.
 *
 * Props:
 * @param {string} studentEmail - The email of the student to unenroll.
 * @param {string} courseId - The ID of the course from which to unenroll the student.
 */
const DeleteEnrollment = ({ studentEmail, courseId }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.table.data);

  const [isError, openError, closeError] = useToggle(false);
  const [isConfirmationOpen, openConfirmation, closeConfirmation] = useToggle(false);
  const [showSuccessToast, openSuccessToast, closeSuccessToast] = useToggle(false);

  const resetModals = () => {
    setMessage('');
    closeConfirmation();
    closeSuccessToast();
    closeError();
    setIsSubmitting(false);
  };

  const handleDeleteEnrollment = async () => {
    setIsSubmitting(true);
    try {
      const response = await deleteEnrollment(studentEmail, courseId);
      const result = response?.data?.results?.[0];

      if (result?.error) {
        setMessage(ERROR_MESSAGE);
        openError();
      } else {
        const updatedStudents = students.filter(
          (student) => student.learnerEmail !== studentEmail,
        );

        dispatch(fetchStudentsDataSuccess({
          results: updatedStudents,
          count: updatedStudents.length,
        }));

        setMessage('Enrollment deleted successfully.');
        closeConfirmation();
        openSuccessToast();
      }
    } catch {
      setMessage('Unexpected error occurred. Please try again later.');
      openError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dropdown.Item
        className="text-truncate text-decoration-none custom-text-black"
        onClick={openConfirmation}
        data-testid="delete-enrollment"
      >
        Delete Enrollment
      </Dropdown.Item>

      <ModalDialog
        title="Delete Enrollment"
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        hasCloseButton
        isFullscreenOnMobile
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Delete Enrollment
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          You are attempting to unenroll a student.
          This action will revoke the student&apos;s course access and return the license to the pool.
          <br />
          Do you wish to proceed?
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button onClick={handleDeleteEnrollment} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Proceed'}
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>

      <ModalDialog
        title="Error"
        isOpen={isError}
        onClose={closeError}
        hasCloseButton
        isFullscreenOnMobile
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Error
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          {message}
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <Button onClick={resetModals}>
              Dismiss
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>

      <Toast
        onClose={closeSuccessToast}
        show={showSuccessToast}
        className="toast-message"
        data-testid="toast-message"
      >
        {message}
      </Toast>
    </>
  );
};

DeleteEnrollment.propTypes = {
  studentEmail: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default DeleteEnrollment;
