import React, {
  useContext, useEffect, useReducer, useState,
} from 'react';
import { Col, Form } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { Select, Button } from 'react-paragon-topaz';
import { getClassesByInstitution } from 'features/Students/data/api';
import { getCoursesByInstitution } from 'features/Common/data/api';
import { InstitutionContext } from 'features/Main/institutionContext';
import reducer from 'features/Students/StudentsFilters/reducer';
import {
  FETCH_COURSES_DATA_REQUEST,
  FETCH_COURSES_DATA_SUCCESS,
  FETCH_COURSES_DATA_FAILURE,
  FETCH_CLASSES_DATA_REQUEST,
  FETCH_CLASSES_DATA_SUCCESS,
  FETCH_CLASSES_DATA_FAILURE,
} from 'features/Students/actionTypes';
import { RequestStatus } from 'features/constants';
import PropTypes from 'prop-types';

const initialState = {
  courses: {
    data: [],
    status: RequestStatus.SUCCESS,
    error: null,
  },
  classes: {
    data: [],
    status: RequestStatus.SUCCESS,
    error: null,
  },
};

const StudentsFilters = ({ resetPagination, fetchData }) => {
  const stateInstitution = useContext(InstitutionContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [courseOptions, setCourseOptions] = useState([]);
  const [classesOptions, setClassesOptions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courseSelected, setCourseSelected] = useState(null);
  const [classSelected, setClassSelected] = useState(null);
  const [statusSelected, setStatusSelected] = useState(null);
  const [examSelected, setExamSelected] = useState(null);
  // check this after implementation of selector institution
  let id = 0;
  if (stateInstitution.length > 0) {
    id = stateInstitution[0].id;
  }

  const fetchCoursesData = async () => {
    dispatch({ type: FETCH_COURSES_DATA_REQUEST });

    try {
      const response = camelCaseObject(await getCoursesByInstitution(id));
      dispatch({ type: FETCH_COURSES_DATA_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_COURSES_DATA_FAILURE, payload: error });
      logError(error);
    }
  };

  const fetchClassesData = async (courseName) => {
    dispatch({ type: FETCH_CLASSES_DATA_REQUEST });

    try {
      const response = camelCaseObject(await getClassesByInstitution(id, courseName));
      dispatch({ type: FETCH_CLASSES_DATA_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_CLASSES_DATA_FAILURE, payload: error });
      logError(error);
    }
  };

  const handleCleanFilters = () => {
    fetchData();
    resetPagination();
    setStudentName('');
    setStudentEmail('');
    setCourseSelected(null);
    setClassSelected(null);
    setStatusSelected(null);
    setExamSelected(null);
  };

  useEffect(() => {
    if (id > 0) {
      fetchCoursesData();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (courseSelected) {
      fetchClassesData(courseSelected.value);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSelected]);

  useEffect(() => {
    if (state.courses.data.length > 0) {
      const options = state.courses.data.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      }));
      setCourseOptions(options);
    }
  }, [state.courses]);

  const handleStudentsFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    try {
      fetchData(formJson);
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    if (state.classes.data.length > 0) {
      const options = state.classes.data.map(ccx => ({
        ...ccx,
        label: ccx.className,
        value: ccx.className,
      }));
      setClassesOptions(options);
    }
  }, [state.classes]);

  return (
    <div className="filter-container justify-content-center row">
      <div className="col-11">
        <h3>Search</h3>
        <Form className="row justify-content-center" onSubmit={handleStudentsFilter}>
          <Form.Row className="col-12">
            <Form.Group as={Col}>
              <Form.Control
                type="text"
                floatingLabel="Student Name"
                name="learner_name"
                placeholder="Enter Student Name"
                onChange={(e) => setStudentName(e.target.value)}
                value={studentName}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Control
                type="email"
                floatingLabel="Student Email"
                name="learner_email"
                placeholder="Enter Student Email"
                onChange={(e) => setStudentEmail(e.target.value)}
                value={studentEmail}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row className="col-12">
            <Form.Group as={Col}>
              <Select
                placeholder="Course"
                name="course_name"
                className="mr-2"
                options={courseOptions}
                onChange={option => setCourseSelected(option)}
                value={courseSelected}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Select
                placeholder="Class"
                className="mr-2"
                name="class_name"
                isDisabled={!courseSelected}
                options={classesOptions}
                onChange={option => setClassSelected(option)}
                value={classSelected}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Select
                placeholder="Status"
                name="status"
                className="mr-2"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Expired', label: 'Expired' },
                  { value: 'Pending', label: 'Pending' },
                ]}
                onChange={option => setStatusSelected(option)}
                value={statusSelected}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Select
                placeholder="Exam ready"
                name="exam_ready"
                className="mr-2"
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                ]}
                onChange={option => setExamSelected(option)}
                value={examSelected}
              />
            </Form.Group>
          </Form.Row>
          <div className="d-flex col-12 justify-content-end mr-3">
            <Button onClick={handleCleanFilters} variant="tertiary" text className="mr-2">Reset</Button>
            <Button type="submit">Apply</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

StudentsFilters.propTypes = {
  fetchData: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
};

export default StudentsFilters;
