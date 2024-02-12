import React, {
  useState, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, Col,
} from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { fetchInstructorsData, fetchCoursesData } from 'features/Instructors/data/thunks';
import { updateFilters, updateCurrentPage } from 'features/Instructors/data/slice';
import PropTypes from 'prop-types';
import { initialPage } from 'features/constants';

const InstructorsFilters = ({ resetPagination, isAssignModal }) => {
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateInstructors = useSelector((state) => state.instructors.courses);
  const currentPage = useSelector((state) => state.instructors.table.currentPage);
  const dispatch = useDispatch();
  const [courseOptions, setCourseOptions] = useState([]);
  const [instructorName, setInstructorName] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [courseSelected, setCourseSelected] = useState(null);
  const [inputFieldDisplay, setInputFieldDisplay] = useState('name');

  const handleCleanFilters = () => {
    dispatch(fetchInstructorsData(selectedInstitution?.id, currentPage));
    resetPagination();
    setInstructorName('');
    setInstructorEmail('');
    setCourseSelected(null);
    dispatch(updateFilters({}));
  };

  const handleInstructorsFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    dispatch(updateFilters(formJson));
    try {
      dispatch(updateCurrentPage(initialPage));
      dispatch(fetchInstructorsData(selectedInstitution?.id, initialPage, formJson));
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0 && !isAssignModal) {
      dispatch(fetchCoursesData(selectedInstitution.id));
    }
  }, [selectedInstitution, dispatch, isAssignModal]);

  useEffect(() => {
    if (stateInstructors.data.length > 0) {
      const options = stateInstructors.data.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      }));
      setCourseOptions(options);
    }
  }, [stateInstructors]);

  return (
    <div className="filter-container justify-content-center row">
      <div className="col-11 px-0">
        <h3>Search</h3>
        <div className="filters">
          <Form className="row justify-content-center" onSubmit={handleInstructorsFilter}>
            <Form.Row className="col-12">
              <Form.Group>
                <Form.RadioSet
                  name="inputField"
                  onChange={(e) => setInputFieldDisplay(e.target.value)}
                  defaultValue="name"
                  isInline
                >
                  <Form.Radio value="name">Instructor name</Form.Radio>
                  <Form.Radio value="email" data-testid="emailCheckbox">Instructor email</Form.Radio>
                </Form.RadioSet>
              </Form.Group>
            </Form.Row>
            <Form.Row className="col-12">
              {inputFieldDisplay === 'name' && (
                <Form.Group as={Col}>
                  <Form.Control
                    type="text"
                    floatingLabel="Instructor Name"
                    name="instructor_name"
                    placeholder="Enter Instructor Name"
                    onChange={(e) => setInstructorName(e.target.value)}
                    value={instructorName}
                    data-testid="instructorName"
                  />
                </Form.Group>
              )}
              {inputFieldDisplay === 'email' && (
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
              )}
            </Form.Row>
            <div className={`col-12 px-1 d-flex align-items-baseline ${isAssignModal ? 'justify-content-end' : 'justify-content-between'}`}>
              {!isAssignModal && (
                <Form.Row className="col-6">
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
              )}
              <div className="d-flex col-4 justify-content-end mr-3">
                <Button onClick={handleCleanFilters} variant="tertiary" text className="mr-2">Reset</Button>
                <Button type="submit">Apply</Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

InstructorsFilters.propTypes = {
  resetPagination: PropTypes.func.isRequired,
  isAssignModal: PropTypes.bool,
};

InstructorsFilters.defaultProps = {
  isAssignModal: false,
};

export default InstructorsFilters;
