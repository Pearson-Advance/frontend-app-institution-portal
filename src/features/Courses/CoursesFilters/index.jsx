import React, { useState, useEffect } from 'react';

import { Col, Form } from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';
import PropTypes from 'prop-types';

const CoursesFilters = ({
  fetchData, resetPagination, dataCourses, setFilters,
}) => {
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseSelected, setCourseSelected] = useState(null);

  const handleCoursesFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    setFilters(formJson);
    try {
      fetchData(formJson);
    } catch (error) {
      logError(error);
    }
  };

  const handleCleanFilters = () => {
    fetchData();
    resetPagination();
    setCourseSelected(null);
    setFilters({});
  };

  useEffect(() => {
    if (dataCourses.length > 0) {
      const options = dataCourses.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      }));
      setCourseOptions(options);
    }
  }, [dataCourses]);

  return (
    <div className="filter-container justify-content-center row">
      <div className="col-11">
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
            <div className="d-flex col-3 justify-content-end mr-3 align-items-start">
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
  fetchData: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
  dataCourses: PropTypes.instanceOf(Array).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default CoursesFilters;
