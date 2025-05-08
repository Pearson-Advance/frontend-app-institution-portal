import React from 'react';
import PropTypes from 'prop-types';
import { ModalDialog, ModalCloseButton } from '@edx/paragon';

import { Button } from 'react-paragon-topaz';

import { deactivationMessage } from 'features/constants';

const ActivationModal = ({ isOpen, onClose, handleDeactivateStatus }) => (
  <ModalDialog
    title="Activation Modal"
    isOpen={isOpen}
    onClose={onClose}
    hasCloseButton
  >
    <ModalDialog.Header>
      <ModalDialog.Title>Confirm deactivation</ModalDialog.Title>
    </ModalDialog.Header>
    <ModalDialog.Body className="body-container h-100">
      <p className="delete-event-text">
        {deactivationMessage}
      </p>
      <div className="d-flex justify-content-end">
        <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2">
          Cancel
        </ModalCloseButton>
        <Button type="submit" onClick={handleDeactivateStatus}>
          Accept
        </Button>
      </div>
    </ModalDialog.Body>
  </ModalDialog>
);

ActivationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleDeactivateStatus: PropTypes.func.isRequired,
};

export default ActivationModal;
