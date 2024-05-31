import React from 'react';
import PropTypes from 'prop-types';

import { ModalDialog, ModalCloseButton } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';

import 'features/Common/DeleteModal/index.scss';

const DeleteModal = ({
  isOpen, onClose, title, textModal, labelDeleteButton, handleDelete,
}) => (
  <ModalDialog
    title={title || 'Delete'}
    isOpen={isOpen}
    onClose={onClose}
    hasCloseButton
    className="delete-modal"
  >
    <ModalDialog.Header className="py-4">
      <ModalDialog.Title>{title || 'Delete'}</ModalDialog.Title>
    </ModalDialog.Header>
    <ModalDialog.Body className="body-container">
      <p>{textModal}</p>
      <div className="d-flex justify-content-end">
        <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2">
          Cancel
        </ModalCloseButton>
        <Button
          type="submit"
          className="btn-danger"
          onClick={handleDelete}
        >
          {labelDeleteButton || 'Delete'}
        </Button>
      </div>
    </ModalDialog.Body>
  </ModalDialog>
);

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  textModal: PropTypes.string,
  labelDeleteButton: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
};

DeleteModal.defaultProps = {
  title: '',
  textModal: '',
  labelDeleteButton: '',
};

export default DeleteModal;
