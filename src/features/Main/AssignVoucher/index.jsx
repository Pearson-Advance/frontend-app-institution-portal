import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Dropdown, Toast, useToggle } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';

import { assignVoucher } from 'features/Courses/data/api';

const AssignVoucher = ({ courseId, learnerEmail }) => {
  const enableOption = getConfig().PSS_ENABLE_ASSIGN_VOUCHER || false;
  const institution = useSelector((state) => state.main.selectedInstitution);
  const [showToast, openToast, closeToast] = useToggle(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!enableOption) { return null; }

  const assignVouchers = async () => {
    if (isLoading || !courseId || !learnerEmail || !institution?.uuid) { return; }

    setIsLoading(true);

    try {
      const payload = {
        institution_uuid: institution.uuid,
        course_id: courseId,
        email: learnerEmail,
      };

      const response = await assignVoucher(payload);

      if (response?.status === 200) {
        setToastMessage('Voucher assigned successfully.');
      }

      openToast();
    } catch (error) {
      setToastMessage('An unexpected error occurred while assigning the voucher.');
      logError('Error assigning voucher:', error);
      openToast();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dropdown.Item
        className={`text-truncate text-decoration-none custom-text-black ${isLoading ? 'opacity-50' : ''}`}
        onClick={assignVouchers}
        disabled={isLoading}
      >
        <i className="fa-solid fa-ticket mr-2" />
        {isLoading ? 'Assigning...' : 'Assign a voucher'}
      </Dropdown.Item>

      <Toast
        onClose={closeToast}
        show={showToast}
        className="toast-message"
        data-testid="toast-message"
      >
        {toastMessage}
      </Toast>
    </>
  );
};

AssignVoucher.propTypes = {
  courseId: PropTypes.string.isRequired,
  learnerEmail: PropTypes.string.isRequired,
};

export default AssignVoucher;
