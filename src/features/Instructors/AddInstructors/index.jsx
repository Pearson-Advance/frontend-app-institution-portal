import React, { useState, useReducer, useEffect } from 'react';
import {
  Button, FormGroup, ModalDialog, useToggle, Form,
} from '@edx/paragon';
import { getCCXList } from 'features/Instructors/data/api';
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

const addInstructorState = {
  instructorInfo: '',
  ccxId: '',
  ccxName: '',
};

const AddInstructors = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpen, open, close] = useToggle(false);
  const [addInstructorInfo, setAddInstructorInfo] = useState(addInstructorState);

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

  const handleInstructorInput = (e) => {
    setAddInstructorInfo({
      ...addInstructorInfo,
      instructorInfo: e.target.value.trim(),
    });
  };

  const handleCcxSelect = (e) => {
    const select = e.target;
    setAddInstructorInfo({
      ...addInstructorInfo,
      ccxId: select.value,
      ccxName: select.options[select.selectedIndex].text,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Button variant="primary" onClick={open} size="sm">
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
          <FormGroup>
            <Form.Control
              as="select"
              floatingLabel="Select Class Name"
              className="my-4 mr-0"
              onChange={handleCcxSelect}
              id="selectCcx"
            >
              {state.data.map((ccx) => <option value={ccx.classId}>{ccx.className}</option>)}
            </Form.Control>
            <Form.Control
              type="text"
              placeholder="Enter Username or Email of the instructor"
              floatingLabel="Username or Email"
              value={addInstructorInfo.instructorInfo}
              onChange={handleInstructorInput}
              className="my-4 mr-0"
            />
            <div className="d-flex justify-content-end">
              <Button>Add</Button>
            </div>
          </FormGroup>
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

export default AddInstructors;
