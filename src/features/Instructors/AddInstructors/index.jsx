// This component will be modified according to the new wirefrime

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  FormGroup, ModalDialog, Form, ModalCloseButton, Toast,
} from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { addInstructor } from 'features/Instructors/data/thunks';

const AddInstructors = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const [showToast, setShowToast] = useState(false);
  const successMessage = 'Email invite has been sent successfully';

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const { instructorEmail } = formJson;

    if (!instructorEmail) {
      onClose();
      return;
    }

    try {
      dispatch(addInstructor(selectedInstitution.id, instructorEmail));
      onClose();
      setShowToast(true);
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
      >
        {successMessage}
      </Toast>
      <ModalDialog
        title="Add Instructor"
        isOpen={isOpen}
        onClose={onClose}
        hasCloseButton
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Add new instructor
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Form onSubmit={handleAddInstructor}>
            <FormGroup controlId="instructorInfo">
              <Form.Control
                type="email"
                placeholder="Enter Email of the instructor"
                floatingLabel="Email"
                className="my-4 mr-0"
                name="instructorEmail"
                required
              />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <ModalCloseButton className="btntpz btn-text btn-tertiary">Cancel</ModalCloseButton>
              <Button type="submit">Send invite</Button>
            </div>
          </Form>
        </ModalDialog.Body>
      </ModalDialog>
    </>

  );
};

AddInstructors.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddInstructors;
