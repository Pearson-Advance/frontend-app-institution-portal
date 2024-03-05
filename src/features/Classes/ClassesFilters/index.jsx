import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Col, Form } from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { initialPage } from 'features/constants';
import { fetchClassesData } from 'features/Classes/data/thunks';
import { fetchCoursesOptionsData } from 'features/Courses/data/thunks';
import { fetchInstructorsOptionsData } from 'features/Instructors/data/thunks';
import { updateFilters, updateCurrentPage } from 'features/Licenses/data/slice';

const notAssignedOption = {
  label: 'Not assigned',
  value: 'null',
};

const ClassesFilters = ({ resetPagination }) => {
  const dispatch = useDispatch();

  const institution = useSelector((state) => state.main.selectedInstitution);
  const courses = useSelector((state) => state.courses.selectOptions);
  const instructors = useSelector((state) => state.instructors.selectOptions);

  const [courseOptions, setCourseOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([notAssignedOption]);
  const [courseSelected, setCourseSelected] = useState(null);
  const [instructorSelected, setInstructorSelected] = useState(null);

  const isButtonDisabled = courseSelected === null && instructorSelected === null;

  const handleSelectFilters = async (e) => {
    e.preventDefault();

    if (isButtonDisabled) {
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const instructor = `instructor=${instructorSelected?.value === 'null' ? '' : instructorSelected?.value}`;
    const instructorsQuery = `${instructorSelected?.value === 'null' ? 'null' : ''}`;

    try {
      dispatch(updateFilters(formJson));
      dispatch(updateCurrentPage(initialPage));
      dispatch(fetchClassesData(institution.id, initialPage, formJson?.course_name, instructor, instructorsQuery));
    } catch (error) {
      logError(error);
    }
  };

  const handleCleanFilters = () => {
    dispatch(fetchClassesData(institution.id, initialPage));
    resetPagination();
    setInstructorSelected(null);
    setCourseSelected(null);
    dispatch(updateFilters({}));
  };

  useEffect(() => {
    const parseCoursesToOptions = courses.length > 0
      ? courses.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      })) : [];

    const parseInstructorsToOptions = instructors?.length > 0
      ? instructors.map(instructor => ({
        ...instructor,
        label: instructor.instructorName,
        value: instructor.instructorUsername,
      }))
      : [];

    setCourseOptions(parseCoursesToOptions);
    setInstructorOptions([notAssignedOption, ...parseInstructorsToOptions]);
  }, [instructors, courses]);

  useEffect(() => {
    setInstructorSelected(null);
    setCourseSelected(null);

    if (Object.keys(institution).length > 0) {
      dispatch(fetchCoursesOptionsData(institution.id));
      dispatch(fetchInstructorsOptionsData(institution.id, initialPage, { limit: false }));
    }
  }, [institution, dispatch]);

  return (
    <Form onSubmit={handleSelectFilters} className="w-100 px-4 d-flex flex-column align-items-center">
      <Form.Row className="px-0 d-flex flex-wrap w-100">
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="Course"
            name="course_name"
            className="mr-2 select"
            options={courseOptions}
            onChange={option => setCourseSelected(option)}
            value={courseSelected}
          />
        </Form.Group>
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="Instructor"
            name="username"
            options={instructorOptions}
            onChange={option => setInstructorSelected(option)}
            value={instructorSelected}
          />
        </Form.Group>
      </Form.Row>
      <Form.Group className="w-100 d-flex justify-content-end px-0">
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
      </Form.Group>
    </Form>
  );
};

ClassesFilters.propTypes = {
  resetPagination: PropTypes.func.isRequired,
};

export default ClassesFilters;
