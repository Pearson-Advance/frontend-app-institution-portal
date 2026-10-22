import React from 'react';
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

const EnrollModal = ({
  isOpen,
  onClose,
  subtitleLabel,
  subtitleValue,
  onSubmit,
  isLoading,
  showToast,
  setShowToast,
  toastMessage,
}) => (
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
          {subtitleLabel}: {subtitleValue}
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
          <Form onSubmit={onSubmit}>
            <FormGroup controlId="studentInfo">
              <Form.Control
                as="textarea"
                placeholder="Enter email of the student to enroll"
                floatingLabel="Email"
                className="my-4 mr-0 student-email"
                name="studentEmail"
                required
                autoResize
              />
            </FormGroup>

            <div className="d-flex justify-content-end">
              <ModalCloseButton
                className="btntpz btn-text btn-tertiary mr-2"
                onClick={onClose}
              >
                Cancel
              </ModalCloseButton>
              <Button type="submit">Send invite</Button>
            </div>
          </Form>
        )}
      </ModalDialog.Body>
    </ModalDialog>
  </>
);

EnrollModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subtitleLabel: PropTypes.string.isRequired,
  subtitleValue: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showToast: PropTypes.bool.isRequired,
  setShowToast: PropTypes.func.isRequired,
  toastMessage: PropTypes.string.isRequired,
};

EnrollModal.defaultProps = {
  subtitleValue: '',
};

export default EnrollModal;
