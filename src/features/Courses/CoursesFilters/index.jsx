import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Col, Form } from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { updateFilters, updateCurrentPage } from 'features/Courses/data/slice';
import { fetchCoursesData, fetchCoursesOptionsData } from 'features/Courses/data/thunks';

import { initialPage } from 'features/constants';

const CoursesFilters = ({ resetPagination }) => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const courses = useSelector((state) => state.courses.selectOptions);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseSelected, setCourseSelected] = useState(null);

  const isButtonDisabled = courseSelected === null;

  const handleCoursesFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    dispatch(updateFilters(formJson));
    try {
      dispatch(updateCurrentPage(initialPage));
      dispatch(fetchCoursesData(selectedInstitution.id, initialPage, formJson));
    } catch (error) {
      logError(error);
    }
  };

  const handleCleanFilters = () => {
    dispatch(fetchCoursesData(selectedInstitution.id));
    resetPagination();
    setCourseSelected(null);
    dispatch(updateFilters({}));
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      setCourseSelected(null);
      dispatch(fetchCoursesOptionsData(selectedInstitution.id));
    }
  }, [selectedInstitution, dispatch]);

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
      <div className="col-11 px-0">
        <h3>Find  a course</h3>
        <Form className="row justify-content-center" onSubmit={handleCoursesFilter}>
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
            <div className="d-flex col-3 justify-content-end align-items-start">
              <Button
                onClick={handleCleanFilters}
                variant="tertiary"
                text
                className="mr-2"
                disabled={isButtonDisabled}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isButtonDisabled}>Apply</Button>
            </div>
          </Form.Row>
        </Form>
      </div>
    </div>
  );
};

CoursesFilters.propTypes = {
  resetPagination: PropTypes.func.isRequired,
};

export default CoursesFilters;
