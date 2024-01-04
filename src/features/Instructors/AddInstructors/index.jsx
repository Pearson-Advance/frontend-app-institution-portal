// This component will be modified according to the new wirefrime

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormGroup, ModalDialog, useToggle, Form,
} from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { handleInstructorsEnrollment } from 'features/Instructors/data/api';
import { logError } from '@edx/frontend-platform/logging';
import { fetchClassesData } from 'features/Instructors/data/thunks';

const AddInstructors = () => {
  const stateInstructors = useSelector((state) => state.instructors.classes);
  const dispatch = useDispatch();
  const [isOpen, open, close] = useToggle(false); // eslint-disable-line no-unused-vars
  const [isNoUser, setIsNoUser] = useState(false);
  const enrollmentData = new FormData();

  const handleAddInstructors = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    try {
      enrollmentData.append('unique_student_identifier', formJson.instructorInfo);
      enrollmentData.append('rolename', 'staff');
      enrollmentData.append('action', 'allow');
      const response = await handleInstructorsEnrollment(enrollmentData, formJson.ccxId);
      if (response.data?.userDoesNotExist) {
        setIsNoUser(true);
      } else {
        close();
        setIsNoUser(false);
      }
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    dispatch(fetchClassesData());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Button variant="outline-primary" size="sm">
        Add Instructor
      </Button>
      <ModalDialog
        title="Add Instructor"
        isOpen={isOpen}
        onClose={close}
        hasCloseButton
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Add Instructor
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Form onSubmit={handleAddInstructors}>
            <FormGroup controlId="ccxId">
              <Form.Control
                as="select"
                floatingLabel="Select Class Name"
                className="my-4 mr-0"
                name="ccxId"
              >
                <option disabled value="null">Select an Option</option>
                {stateInstructors.data.map((ccx) => <option value={ccx.classId}>{ccx.className}</option>)}
              </Form.Control>
            </FormGroup>
            <FormGroup controlId="instructorInfo">
              <Form.Control
                type="text"
                placeholder="Enter Username or Email of the instructor"
                floatingLabel="Username or Email"
                className="my-4 mr-0"
                name="instructorInfo"
              />
              {isNoUser && (
                <Form.Control.Feedback type="invalid">
                  User does not exist
                </Form.Control.Feedback>
              )}
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button type="submit">Add</Button>
            </div>
          </Form>

        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

export default AddInstructors;
