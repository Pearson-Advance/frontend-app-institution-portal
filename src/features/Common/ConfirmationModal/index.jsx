//TODO: move common components to library
import React from 'react';
import PropTypes from 'prop-types';
import { ModalDialog, ModalCloseButton } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) => (
  <ModalDialog
    title={title}
    isOpen={isOpen}
    onClose={onClose}
    hasCloseButton
  >
    <ModalDialog.Header>
      <ModalDialog.Title>{title}</ModalDialog.Title>
    </ModalDialog.Header>
    <ModalDialog.Body className="body-container h-100">
      <p className="confirmation-message">{message}</p>
      <div className="d-flex justify-content-end">
        <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2">
          {cancelLabel}
        </ModalCloseButton>
        <Button type="submit" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </ModalDialog.Body>
  </ModalDialog>
);

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

export default ConfirmationModal;
