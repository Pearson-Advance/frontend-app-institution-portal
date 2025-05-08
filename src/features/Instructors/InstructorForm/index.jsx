import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Form,
  Icon,
  Toast,
  Alert,
  Spinner,
  FormGroup,
  ModalDialog,
  ModalCloseButton,
} from '@edx/paragon';

import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';
import { getConfig } from '@edx/frontend-platform';
import { Info, Close, MailOutline } from '@edx/paragon/icons';

import { RequestStatus } from 'features/constants';
import { addInstructor, editInstructor } from 'features/Instructors/data/thunks';
import { updateInstructorFormRequest, resetInstructorFormRequest } from 'features/Instructors/data/slice';

import './index.scss';

const SUCCESS_MESSAGE = 'Email invite has been sent successfully';

const initialState = {
  showToast: false,
  instructor: {
    email: '',
    firstName: '',
    lastName: '',
    hasEnrollmentPrivilege: false,
  },
};

const InstructorForm = ({
  isOpen, onClose, isEditing, instructorInfo,
}) => {
  const enableEnrollmentToggle = getConfig()?.SHOW_INSTRUCTOR_FEATURES || false;

  const dispatch = useDispatch();
  const instructorRequest = useSelector((state) => state.instructors.instructorForm);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const [formState, setFormState] = useState(initialState);

  const handleInputChange = (e) => {
    const {
      name,
      type,
      value,
      checked,
    } = e.target;

    setFormState({
      ...formState,
      instructor: {
        ...formState.instructor,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  const handleCloseModal = () => {
    onClose();
    setFormState(initialState);
    dispatch(resetInstructorFormRequest());
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();

    if (formState.instructor.email.length === 0) {
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('instructor_email', formState.instructor.email);
      formData.append('first_name', formState.instructor.firstName);
      formData.append('last_name', formState.instructor.lastName);

      if (formState.instructor.hasEnrollmentPrivilege) {
        formData.append('has_enrollment_privilege', formState.instructor.hasEnrollmentPrivilege);
      }

      await dispatch(addInstructor(selectedInstitution.id, formData));
      handleCloseModal();
      setFormState({ ...initialState, showToast: true });
      dispatch(updateInstructorFormRequest({ status: RequestStatus.INITIAL }));

      setTimeout(() => {
        setFormState(initialState);
      }, 5000);
    } catch (error) {
      logError(error);
    }

    return null;
  };

  const handleEditInstructor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('enrollment_privilege', formState.instructor.hasEnrollmentPrivilege);
      formData.append('institution_id', selectedInstitution.id);
      formData.append('instructor_id', instructorInfo.instructorId);

      await dispatch(editInstructor(formData));
      handleCloseModal();
      dispatch(updateInstructorFormRequest({ status: RequestStatus.INITIAL }));
    } catch (error) {
      logError(error);
    }
  };

  const isValidInstructorInfo = (info) => (
    info
    && typeof info.instructorEmail === 'string'
    && info.instructorEmail.trim() !== ''
    && typeof info.hasEnrollmentPrivilege === 'boolean'
  );

  useEffect(() => {
    dispatch(updateInstructorFormRequest({ status: RequestStatus.INITIAL }));

    return () => dispatch(resetInstructorFormRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isEditing && isValidInstructorInfo(instructorInfo)) {
      setFormState(prev => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          email: instructorInfo.instructorEmail,
          hasEnrollmentPrivilege: instructorInfo?.hasEnrollmentPrivilege,
        },
      }));
    }
  }, [isEditing, instructorInfo]);

  return (
    <>
      <Toast
        onClose={() => setFormState(initialState)}
        show={formState.showToast}
      >
        {SUCCESS_MESSAGE}
      </Toast>
      <ModalDialog
        title={isEditing ? 'Edit Instructor' : 'Add Instructor'}
        isOpen={isOpen}
        onClose={handleCloseModal}
        hasCloseButton
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {isEditing ? `Edit ${instructorInfo.instructorName}` : 'Add new instructor'}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          {
            instructorRequest.status === RequestStatus.LOADING && (
              <div className="loading-wrapper">
                <Spinner animation="border" className="me-3" />
                <p>Loading...</p>
              </div>
            )
          }
          {(instructorRequest.status === RequestStatus.INITIAL
            || instructorRequest.status === RequestStatus.COMPLETE_WITH_ERRORS) && (
              <Form>
                <FormGroup controlId="formState">
                  {!isEditing && (
                    <>
                      <Form.Control
                        type="email"
                        placeholder="Enter Email of the instructor"
                        floatingLabel="Email *"
                        className="my-4 mr-0"
                        name="email"
                        leadingElement={<Icon src={MailOutline} className="mt-2 icon" />}
                        onChange={handleInputChange}
                        value={formState.instructor.email}
                        required
                      />
                      <Form.Control
                        type="text"
                        placeholder="Enter the first name of the instructor"
                        floatingLabel="First name"
                        className="my-4 mr-0"
                        name="firstName"
                        onChange={handleInputChange}
                        value={formState.instructor.firstName}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Enter the last name of the instructor"
                        floatingLabel="Last name"
                        className="my-4 mr-0"
                        name="lastName"
                        onChange={handleInputChange}
                        value={formState.instructor.lastName}
                      />
                    </>
                  )}
                  {
                    enableEnrollmentToggle && (
                      <Form.Switch
                        className="mr-0"
                        name="hasEnrollmentPrivilege"
                        onChange={handleInputChange}
                        checked={formState.instructor.hasEnrollmentPrivilege}
                      >
                        Has enrollment permission
                      </Form.Switch>
                    )
                  }
                </FormGroup>
                {instructorRequest.status === RequestStatus.COMPLETE_WITH_ERRORS && (
                  <Alert
                    variant="danger"
                    icon={Info}
                    actions={[
                      <Button variant="outline-primary" onClick={() => dispatch(resetInstructorFormRequest())}>
                        <Close />
                      </Button>,
                    ]}
                  >
                    <Alert.Heading>We could not process this request.</Alert.Heading>
                    <p>
                      {instructorRequest.error}
                    </p>
                  </Alert>
                )}
                <div className="d-flex justify-content-end">
                  <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2" onClose={handleCloseModal}>Cancel</ModalCloseButton>
                  <Button
                    type="submit"
                    disabled={!isEditing && formState.instructor.email.length === 0}
                    onClick={isEditing ? handleEditInstructor : handleAddInstructor}
                  >
                    {isEditing ? 'Edit instructor' : 'Add instructor'}
                  </Button>
                </div>
              </Form>
          )}
        </ModalDialog.Body>
      </ModalDialog>
    </>

  );
};

InstructorForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  instructorInfo: PropTypes.shape({
    instructorName: PropTypes.string,
    instructorId: PropTypes.number,
    instructorEmail: PropTypes.string,
    hasEnrollmentPrivilege: PropTypes.bool,
  }),
};

InstructorForm.defaultProps = {
  isEditing: false,
  instructorInfo: {
    instructorName: '',
    instructorEmail: '',
    instructorId: 0,
    hasEnrollmentPrivilege: false,
  },
};

export default InstructorForm;
