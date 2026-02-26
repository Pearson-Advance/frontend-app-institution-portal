import { useState } from 'react';
import {
  Dropdown,
  Toast,
  useToggle,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  ConfirmationModal,
  UNENROLL_MESSAGE,
  CONFIRMATION_UNENROLL_MESSAGE,
  UNENROLL_ERROR_MESSAGE,
} from 'react-paragon-topaz';

import {
  fetchStudentsDataSuccess,
} from 'features/Students/data/slice';
import { deleteEnrollment } from 'features/Main/data/api';

/**
 * DeleteEnrollment allows an administrator to unenroll a student from a course.
 * It handles confirmation, API interaction, error display, and feedback toast.
 *
 * Props:
 * @param {string} studentEmail - The email of the student to unenroll.
 * @param {string} classId - The ID of the class from which to unenroll the student.
 */
const DeleteEnrollment = ({ studentEmail, classId }) => {
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
      const response = await deleteEnrollment(studentEmail, classId);
      const result = response?.data?.results?.[0];

      if (result?.error) {
        setMessage(UNENROLL_ERROR_MESSAGE);
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
        className="text-truncate text-decoration-none text-danger"
        onClick={openConfirmation}
        data-testid="delete-enrollment"
      >
        <i className="fa-regular fa-trash mr-2 mb-1" />
        Delete Enrollment
      </Dropdown.Item>

      <ConfirmationModal
        title="Delete Enrollment"
        isOpen={isConfirmationOpen && !isError}
        onClose={closeConfirmation}
        onConfirm={handleDeleteEnrollment}
        confirmLabel="Proceed"
        cancelLabel="Cancel"
        isFullscreenOnMobile
        isSubmitting={isSubmitting}
      >
        {UNENROLL_MESSAGE}
        <br />
        <br />
        {CONFIRMATION_UNENROLL_MESSAGE}
      </ConfirmationModal>

      <ConfirmationModal
        title="Error"
        isOpen={isError}
        onClose={resetModals}
        hasCloseButton
        isFullscreenOnMobile
        message={message}
        isSubmitting={false}
        onConfirm={resetModals}
        showCancelButton={false}
        confirmLabel="Dismiss"
      />

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
  classId: PropTypes.string.isRequired,
};

export default DeleteEnrollment;
