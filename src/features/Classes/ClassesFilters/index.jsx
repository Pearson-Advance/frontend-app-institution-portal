import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Col, Form } from '@openedx/paragon';
import { Select, Button } from 'react-paragon-topaz';

import { initialPage } from 'features/constants';
import { buildFilterParams } from 'helpers';
import { useGetCoursesOptionsQuery } from 'features/Courses/data/coursesApi';
import { useGetInstructorsOptionsQuery } from 'features/Instructors/data/instructorsApi';
import {
  updateFilters,
  updateFiltersForm,
  resetFiltersForm,
  updateCurrentPage,
} from 'features/Classes/data/slice';

const NOT_ASSIGNED_OPTION = {
  label: 'Not assigned',
  value: 'null',
};

// Stable empty array reference to avoid re-triggering effects while the
// cached queries are loading (a new [] on every render would cause a loop).
const EMPTY_OPTIONS = [];

const getInitialFilters = () => ({
  classFilter: '',
  courseSelected: null,
  instructorSelected: null,
  startDate: '',
  endDate: '',
});

const ClassesFilters = ({ resetPagination }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const firstRenderPage = useRef(false);

  const institution = useSelector((state) => state.main.selectedInstitution);
  const persistedFiltersForm = useSelector((state) => state.classes.filtersForm);

  const { data: courses = EMPTY_OPTIONS, isLoading: isLoadingCourses } = useGetCoursesOptionsQuery(
    { institutionId: institution.id },
    { skip: !institution.id },
  );
  const { data: instructors = EMPTY_OPTIONS, isLoading: isLoadingInstructors } = useGetInstructorsOptionsQuery(
    { institutionId: institution.id, filters: { limit: false } },
    { skip: !institution.id },
  );

  const queryParams = new URLSearchParams(location.search);
  const queryNotInstructors = queryParams.get('instructors');

  const [filters, setFilters] = useState(() => ({
    ...getInitialFilters(),
    ...persistedFiltersForm,
  }));
  const [courseOptions, setCourseOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([NOT_ASSIGNED_OPTION]);

  const {
    classFilter,
    courseSelected,
    instructorSelected,
    startDate,
    endDate,
  } = filters;

  const initialFilters = getInitialFilters();

  const isValidClassFilter = classFilter.trim().length > 1;
  const isButtonDisabled = courseSelected === null
    && instructorSelected === null
    && !isValidClassFilter
    && startDate === initialFilters.startDate
    && endDate === initialFilters.endDate;

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (queryNotInstructors === 'null') {
      dispatch(updateFilters({}));
      updateFilter('instructorSelected', NOT_ASSIGNED_OPTION);
    }
  }, [queryNotInstructors]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectFilters = (e) => {
    e.preventDefault();

    if (isButtonDisabled) { return; }

    const nullInstructor = instructorSelected?.value === 'null';
    const notSelectedInstructor = instructorSelected?.value ?? null;

    const formJson = buildFilterParams({
      instructor: nullInstructor ? null : notSelectedInstructor,
      instructors: nullInstructor ? 'null' : null,
      class_name: classFilter,
      start_date: startDate,
      end_date: endDate,
    });

    const appliedFilters = courseSelected?.value
      ? { ...formJson, courseId: courseSelected.value }
      : formJson;

    dispatch(updateFilters(appliedFilters));
    dispatch(updateFiltersForm(filters));
    dispatch(updateCurrentPage(initialPage));
  };

  const handleCleanFilters = () => {
    dispatch(updateFilters({}));
    dispatch(resetFiltersForm());
    resetPagination();
    setFilters(getInitialFilters());
  };

  useEffect(() => {
    const parseCoursesToOptions = courses.length > 0
      ? courses.map((course) => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseId,
      })) : [];

    const parseInstructorsToOptions = instructors?.length > 0
      ? instructors.map((instructor) => ({
        ...instructor,
        label: instructor.instructorName,
        value: instructor.instructorUsername,
      })) : [];

    setCourseOptions(parseCoursesToOptions);
    setInstructorOptions([NOT_ASSIGNED_OPTION, ...parseInstructorsToOptions]);
  }, [instructors, courses]);

  useEffect(() => {
    if (firstRenderPage.current) {
      setFilters((prev) => ({ ...prev, courseSelected: null, instructorSelected: null }));
    }

    if (queryNotInstructors === 'null') {
      firstRenderPage.current = true;
    }
  }, [institution, queryNotInstructors]);

  return (
    <Form onSubmit={handleSelectFilters} className="w-100 px-4 d-flex flex-column align-items-center">
      <Form.Row className="px-0 d-flex flex-wrap w-100 mr-0">
        <Form.Group as={Col} className="mr-0 w-100 px-0">
          <Form.Control
            className="w-100 mr-0"
            type="text"
            floatingLabel="Class name"
            name="class_name"
            data-testid="class_name"
            onChange={(e) => updateFilter('classFilter', e.target.value)}
            value={classFilter}
          />
        </Form.Group>
      </Form.Row>
      <Form.Row className="px-0 d-flex flex-wrap w-100">
        <Form.Group as={Col} className="w-50 px-0">
          <Form.Control
            type="date"
            floatingLabel="Class start date from"
            className="my-1 mr-2"
            name="start_date"
            data-testid="start_date"
            value={startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} className="w-50 px-0">
          <Form.Control
            type="date"
            floatingLabel="Class start date to"
            className="my-1 mr-0"
            name="end_date"
            data-testid="end_date"
            value={endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
          />
        </Form.Group>
      </Form.Row>
      <Form.Row className="px-0 d-flex flex-wrap w-100">
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="Course"
            name="course_name"
            className="mr-2 select"
            options={courseOptions}
            onChange={(option) => updateFilter('courseSelected', option)}
            value={courseSelected}
            isLoading={isLoadingCourses}
            isDisabled={isLoadingCourses}
          />
        </Form.Group>
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="Instructor"
            name="instructor"
            options={instructorOptions}
            onChange={(option) => updateFilter('instructorSelected', option)}
            value={instructorSelected}
            isLoading={isLoadingInstructors}
            isDisabled={isLoadingInstructors}
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
