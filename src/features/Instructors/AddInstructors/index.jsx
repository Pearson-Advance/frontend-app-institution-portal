import React, { useState, useReducer, useEffect } from 'react';
import {
  FormGroup, ModalDialog, useToggle, Form,
} from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { getCCXList, handleInstructorsEnrollment } from 'features/Instructors/data/api';
import reducer from 'features/Instructors/AddInstructors/reducer';
import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';

import { FETCH_CCX_LIST_FAILURE, FETCH_CCX_LIST_REQUEST, FETCH_CCX_LIST_SUCCESS } from 'features/Instructors/actionTypes';
import { RequestStatus } from 'features/constants';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
};

const AddInstructors = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpen, open, close] = useToggle(false); // eslint-disable-line no-unused-vars
  const [isNoUser, setIsNoUser] = useState(false);
  const enrollmentData = new FormData();

  const fetchData = async () => {
    dispatch({ type: FETCH_CCX_LIST_REQUEST });

    try {
      const response = camelCaseObject(await getCCXList());
      dispatch({ type: FETCH_CCX_LIST_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_CCX_LIST_FAILURE, payload: error });
      logError(error);
    }
  };

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
        fetchData();
        close();
        setIsNoUser(false);
      }
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                {state.data.map((ccx) => <option value={ccx.classId}>{ccx.className}</option>)}
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
