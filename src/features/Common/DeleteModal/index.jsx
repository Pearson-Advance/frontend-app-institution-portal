import React from 'react';
import PropTypes from 'prop-types';

import { ModalDialog, ModalCloseButton, Spinner } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';

import 'features/Common/DeleteModal/index.scss';

const DeleteModal = ({
  isOpen,
  onClose,
  title,
  textModal,
  labelDeleteButton,
  handleDelete,
  isLoading,
}) => (
  <ModalDialog
    title={title}
    isOpen={isOpen}
    onClose={onClose}
    hasCloseButton
    className="delete-modal"
  >
    <ModalDialog.Header className="pb-2">
      <ModalDialog.Title>{title}</ModalDialog.Title>
    </ModalDialog.Header>
    {isLoading && (
      <div className="w-100 h-100 d-flex justify-content-center align-items-center body-container">
        <Spinner
          animation="border"
          className="mie-3"
          screenReaderText="loading"
        />
      </div>
    )}
    {!isLoading && (
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
            {labelDeleteButton}
          </Button>
        </div>
      </ModalDialog.Body>
    )}
  </ModalDialog>
);

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  textModal: PropTypes.string,
  labelDeleteButton: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

DeleteModal.defaultProps = {
  title: 'Delete',
  textModal: '',
  labelDeleteButton: 'Delete',
  isLoading: false,
};

export default DeleteModal;
