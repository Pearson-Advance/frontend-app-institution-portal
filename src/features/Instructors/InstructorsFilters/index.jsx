import React, {
  useState, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Form, Col, Icon,
} from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';
import { Search } from '@edx/paragon/icons';

import { fetchInstructorsData } from 'features/Instructors/data/thunks';
import { updateFilters, updateCurrentPage } from 'features/Instructors/data/slice';
import { fetchCoursesOptionsData } from 'features/Courses/data/thunks';

import { initialPage } from 'features/constants';

const InstructorsFilters = ({ resetPagination, isAssignSection }) => {
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const courses = useSelector((state) => state.courses.selectOptions);
  const dispatch = useDispatch();
  const [courseOptions, setCourseOptions] = useState([]);
  const [instructorName, setInstructorName] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [courseSelected, setCourseSelected] = useState(null);
  const [inputFieldDisplay, setInputFieldDisplay] = useState('name');

  const isButtonDisabled = instructorEmail === '' && instructorName === '' && courseSelected === null;

  const resetFields = () => {
    setInstructorName('');
    setInstructorEmail('');
    setCourseSelected(null);
  };

  const handleCleanFilters = () => {
    dispatch(fetchInstructorsData(selectedInstitution?.id));
    resetPagination();
    dispatch(updateFilters({}));
    resetFields();
  };

  const handleInstructorsFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.delete('inputField');
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
    if (Object.keys(selectedInstitution).length > 0 && !isAssignSection) {
      resetFields();
      dispatch(fetchCoursesOptionsData(selectedInstitution.id));
    }
  }, [selectedInstitution, dispatch, isAssignSection]);

  useEffect(() => {
    const options = courses.length > 0
      ? courses.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      }))
      : [];

    setCourseOptions(options);
  }, [courses]);

  return (
    <div className="filter-container justify-content-center row">
      <div className={isAssignSection ? 'col-12 px-3' : 'col-11 px-0'}>
        {!isAssignSection && (<h3>Search</h3>)}
        <div className={isAssignSection ? 'py-3' : 'filters'}>
          <Form className="row justify-content-center" onSubmit={handleInstructorsFilter}>
            <div className={isAssignSection ? 'd-flex align-items-end justify-content-between col-12 px-1' : 'col-12 px-1'}>
              <div className={isAssignSection ? 'col-8 px-0' : ''}>
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
                        leadingElement={<Icon src={Search} className="mt-2 icon" />}
                        value={instructorName}
                        data-testid="instructorName"
                      />
                    </Form.Group>
                  )}
                  {inputFieldDisplay === 'email' && (
                    <Form.Group as={Col}>
                      <Form.Control
                        type="text"
                        floatingLabel="Instructor Email"
                        name="instructor_email"
                        placeholder="Enter Instructor Email"
                        onChange={(e) => setInstructorEmail(e.target.value)}
                        leadingElement={<Icon src={Search} className="mt-2 icon" />}
                        value={instructorEmail}
                      />
                    </Form.Group>
                  )}
                </Form.Row>
              </div>
              {isAssignSection && (
                <div className="d-flex col-4 justify-content-end mr-3 mb-3">
                  <Button
                    onClick={handleCleanFilters}
                    variant="tertiary"
                    text
                    className="mr-2"
                    disabled={isButtonDisabled}
                  >
                    Reset
                  </Button>
                  <Button
                    variant={`${isAssignSection ? 'outline-primary' : 'primary'}`}
                    type="submit"
                    disabled={isButtonDisabled}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>
            {!isAssignSection && (
              <div className="col-12 px-1 d-flex align-items-baseline justify-content-between">
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
                <div className="d-flex col-4 justify-content-end mr-3">
                  <Button
                    onClick={handleCleanFilters}
                    variant="tertiary"
                    text
                    className="mr-2"
                    disabled={isButtonDisabled}
                  >
                    Reset
                  </Button>
                  <Button
                    variant={`${isAssignSection ? 'outline-primary' : 'primary'}`}
                    type="submit"
                    disabled={isButtonDisabled}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

InstructorsFilters.propTypes = {
  resetPagination: PropTypes.func.isRequired,
  isAssignSection: PropTypes.bool,
};

InstructorsFilters.defaultProps = {
  isAssignSection: false,
};

export default InstructorsFilters;
