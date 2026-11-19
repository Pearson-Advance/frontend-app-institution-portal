import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ModalDialog,
  ModalCloseButton,
  Form,
  Row,
  Col,
  Toast,
} from '@openedx/paragon';
import { Button, Select } from 'react-paragon-topaz';

const initialFormData = {
  sessionName: '',
  startDate: '',
  selectedLicense: null,
};

const AddSessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  sessionData,
  isEditing,
  showToast,
  setShowToast,
  toastMessage,
  licenseOptions,
  isLoadingLicenses,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);

  const modalTitle = isEditing ? 'Edit session' : 'Add session';

  const getSubmitButtonText = () => {
    if (isLoading) { return 'Saving...'; }
    if (isEditing) { return 'Save changes'; }
    return 'Add session';
  };

  useEffect(() => {
    setValidated(false);

    if (isEditing && sessionData) {
      const matchedLicense = licenseOptions.find(
        (opt) => opt.value === sessionData.licenseId,
      ) || null;

      setFormData({
        sessionName: sessionData.sessionName || '',
        startDate: sessionData.startDate ? sessionData.startDate.split('T')[0] : '',
        selectedLicense: matchedLicense,
      });
    } else {
      setFormData({
        ...initialFormData,
        selectedLicense: licenseOptions.length === 1 ? licenseOptions[0] : null,
      });
    }
  }, [isEditing, sessionData, isOpen, licenseOptions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLicenseChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      selectedLicense: option,
    }));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setValidated(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || (!isEditing && !formData.selectedLicense)) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    await onSubmit({
      ...formData,
      licenseId: formData.selectedLicense?.value,
    });
  };

  return (
    <>
      <ModalDialog
        title={modalTitle}
        isOpen={isOpen}
        onClose={handleClose}
        size="md"
        hasCloseButton
      >
        <ModalDialog.Header>
          <ModalDialog.Title>{modalTitle}</ModalDialog.Title>
        </ModalDialog.Header>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <ModalDialog.Body className="body-container h-100">
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                floatingLabel="Session name"
                name="sessionName"
                data-testid="session_name_input"
                value={formData.sessionName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {!isEditing && (
              <Form.Group className="mb-3 mr-2">
                <Select
                  placeholder="Select a license"
                  name="licenseId"
                  className="select"
                  options={licenseOptions}
                  onChange={handleLicenseChange}
                  value={formData.selectedLicense}
                  isLoading={isLoadingLicenses}
                  isDisabled={isLoadingLicenses}
                />
                {validated && !formData.selectedLicense && (
                  <div className="invalid-feedback d-block">
                    Please select a license.
                  </div>
                )}
              </Form.Group>
            )}

            <Row>
              <Col>
                <Form.Group>
                  <Form.Control
                    type="date"
                    floatingLabel="Start date"
                    name="startDate"
                    data-testid="start_date_input"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <ModalCloseButton
                className="btntpz btn-text btn-tertiary mr-2"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </ModalCloseButton>

              <Button
                type="submit"
                disabled={isLoading || (!isEditing && !formData.selectedLicense)}
              >
                {getSubmitButtonText()}
              </Button>
            </div>
          </ModalDialog.Body>
        </Form>
      </ModalDialog>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
      >
        {toastMessage}
      </Toast>
    </>
  );
};

AddSessionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  sessionData: PropTypes.shape({
    sessionId: PropTypes.string,
    sessionName: PropTypes.string,
    startDate: PropTypes.string,
    licenseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  isEditing: PropTypes.bool,
  showToast: PropTypes.bool,
  setShowToast: PropTypes.func,
  toastMessage: PropTypes.string,
  licenseOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })),
  isLoadingLicenses: PropTypes.bool,
};

AddSessionModal.defaultProps = {
  isLoading: false,
  sessionData: null,
  isEditing: false,
  showToast: false,
  setShowToast: () => {},
  toastMessage: '',
  licenseOptions: [],
  isLoadingLicenses: false,
};

export default AddSessionModal;
