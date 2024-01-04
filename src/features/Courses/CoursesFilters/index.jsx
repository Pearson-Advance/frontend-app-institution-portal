import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Form } from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';
import PropTypes from 'prop-types';

import { updateFilters, updateCurrentPage } from 'features/Courses/data/slice';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { initialPage } from 'features/constants';

const CoursesFilters = ({ resetPagination }) => {
  const dispatch = useDispatch();
  const stateInstitution = useSelector((state) => state.main.institution.data);
  const stateCourses = useSelector((state) => state.courses.table.data);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseSelected, setCourseSelected] = useState(null);
  let id = '';
  if (stateInstitution.length === 1) {
    id = stateInstitution[0].id;
  }

  const handleCoursesFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    dispatch(updateFilters(formJson));
    try {
      dispatch(updateCurrentPage(initialPage));
      dispatch(fetchCoursesData(id, initialPage, formJson));
    } catch (error) {
      logError(error);
    }
  };

  const handleCleanFilters = () => {
    dispatch(fetchCoursesData(id));
    resetPagination();
    setCourseSelected(null);
    dispatch(updateFilters({}));
  };

  useEffect(() => {
    if (stateCourses.length > 0) {
      const options = stateCourses.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      }));
      setCourseOptions(options);
    }
  }, [stateCourses]);

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
              <Button onClick={handleCleanFilters} variant="tertiary" text className="mr-2">Reset</Button>
              <Button type="submit">Apply</Button>
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
