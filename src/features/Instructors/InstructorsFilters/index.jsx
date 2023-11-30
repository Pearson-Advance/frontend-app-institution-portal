import React, {
  useState, useReducer, useContext, useEffect,
} from 'react';
import {
  Form, Col,
} from '@edx/paragon';
import { camelCaseObject } from '@edx/frontend-platform';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';
import { InstitutionContext } from 'features/Main/institutionContext';
import reducer from 'features/Instructors/InstructorsFilters/reducer';
import { getCoursesByInstitution } from 'features/Common/data/api';
import {
  FETCH_COURSES_DATA_REQUEST,
  FETCH_COURSES_DATA_SUCCESS,
  FETCH_COURSES_DATA_FAILURE,
} from 'features/Instructors/actionTypes';
import { RequestStatus } from 'features/constants';
import PropTypes from 'prop-types';

const initialState = {
  courses: {
    data: [],
    status: RequestStatus.SUCCESS,
    error: null,
  },
};

const InstructorsFilters = ({ fetchData, resetPagination }) => {
  const stateInstitution = useContext(InstitutionContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [courseOptions, setCourseOptions] = useState([]);
  const [instructorName, setInstructorName] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [courseSelected, setCourseSelected] = useState(null);
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

  const handleCleanFilters = () => {
    fetchData();
    resetPagination();
    setInstructorName('');
    setInstructorEmail('');
    setCourseSelected(null);
  };

  const handleInstructorsFilter = async (e) => {
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
    if (id > 0) {
      fetchCoursesData();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  return (
    <div className="filter-container justify-content-center row">
      <div className="col-11">
        <h3>Search</h3>
        <Form className="row justify-content-center" onSubmit={handleInstructorsFilter}>
          <Form.Row className="col-12">
            <Form.Group as={Col}>
              <Form.Control
                type="text"
                floatingLabel="Instructor Name"
                name="instructor_name"
                placeholder="Enter Instructor Name"
                onChange={(e) => setInstructorName(e.target.value)}
                value={instructorName}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Control
                type="email"
                floatingLabel="Instructor Email"
                name="instructor_email"
                placeholder="Enter Instructor Email"
                onChange={(e) => setInstructorEmail(e.target.value)}
                value={instructorEmail}
              />
            </Form.Group>
          </Form.Row>
          <div className="col-12 px-1">
            <Form.Row className="col-4">
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
            </Form.Row>
          </div>
          <div className="d-flex col-12 justify-content-end mr-3">
            <Button onClick={handleCleanFilters} variant="tertiary" text className="mr-2">Reset</Button>
            <Button type="submit">Apply</Button>
          </div>
        </Form>
      </div>

    </div>
  );
};

InstructorsFilters.propTypes = {
  fetchData: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
};

export default InstructorsFilters;
