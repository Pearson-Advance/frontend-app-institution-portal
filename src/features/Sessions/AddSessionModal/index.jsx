import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  ModalDialog,
  ModalCloseButton,
  Form,
  Row,
  Col,
} from '@openedx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import {
  useAddSessionMutation,
  useEditSessionMutation,
} from 'features/Sessions/data/sessionsApi';

const initialFormData = {
  sessionName: '',
  startDate: '',
  endDate: '',
};

const AddSessionModal = ({
  isOpen,
  onClose,
  programInfo,
  sessionData,
  isEditing,
}) => {
  const institution = useSelector((state) => state.main.selectedInstitution);

  const [addSession, { isLoading: isAdding }] = useAddSessionMutation();
  const [editSession, { isLoading: isEditingSession }] = useEditSessionMutation();

  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);

  const isLoading = isAdding || isEditingSession;

  const modalTitle = isEditing ? 'Edit session' : 'Add session';

  const getSubmitButtonText = () => {
    if (isLoading) { return 'Saving...'; }
    if (isEditing) { return 'Save changes'; }
    return 'Add session';
  };

  useEffect(() => {
    if (isEditing && sessionData) {
      setFormData({
        sessionName: sessionData.sessionName || '',
        startDate: sessionData.startDate ? sessionData.startDate.split('T')[0] : '',
        endDate: sessionData.endDate ? sessionData.endDate.split('T')[0] : '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [isEditing, sessionData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const payload = {
        sessionName: formData.sessionName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        institutionId: institution.id,
        programId: programInfo?.programId,
      };

      if (isEditing) {
        await editSession({ sessionId: sessionData.sessionId, ...payload }).unwrap();
      } else {
        await addSession(payload).unwrap();
      }

      handleClose();
    } catch (error) {
      logError(error);
    }
  };

  return (
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

      <Form validated={validated} onSubmit={handleSubmit}>
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
                  required
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

            <Button type="submit" disabled={isLoading}>
              {getSubmitButtonText()}
            </Button>
          </div>
        </ModalDialog.Body>
      </Form>
    </ModalDialog>
  );
};

AddSessionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  programInfo: PropTypes.shape({
    programId: PropTypes.string,
    programTitle: PropTypes.string,
  }),
  sessionData: PropTypes.shape({
    sessionId: PropTypes.string,
    sessionName: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
  isEditing: PropTypes.bool,
};

AddSessionModal.defaultProps = {
  programInfo: {},
  sessionData: null,
  isEditing: false,
};

export default AddSessionModal;
