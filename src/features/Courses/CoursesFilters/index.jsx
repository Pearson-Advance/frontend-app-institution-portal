import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Form } from '@edx/paragon';
import { Select } from 'react-paragon-topaz';
import { getConfig } from '@edx/frontend-platform';

import { updateFilters, updateCurrentPage, updateShowAllCourses } from 'features/Courses/data/slice';
import { fetchCoursesData, fetchCoursesOptionsData } from 'features/Courses/data/thunks';

import {
  initialPage, styleFirstOption, allResultsOption, RequestStatus,
} from 'features/constants';

const CoursesFilters = () => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const courses = useSelector((state) => state.courses.selectOptions);
  const showAllCourses = useSelector((state) => state.courses.showAllCourses);
  const coursesRequest = useSelector((state) => state.courses.table.status);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseSelected, setCourseSelected] = useState(null);
  const [inputCourse, setInputCourse] = useState('');
  const [defaultOption, setDefaultOption] = useState(allResultsOption);

  const showCoursesToggle = getConfig().enable_toggle_courses || false;

  const filterOptions = (option, input) => {
    if (input) {
      return option.label.toLowerCase().includes(input) || option.value === defaultOption.value;
    }
    return true;
  };

  const handleInputChange = (value, { action }) => {
    if (action === 'input-change') {
      setInputCourse(value);
      setDefaultOption({
        ...defaultOption,
        label: `${allResultsOption.label} for ${value}`,
      });
    }
  };

  const handleToggleChange = e => dispatch(updateShowAllCourses(e.target.checked));

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

    setCourseOptions([defaultOption, ...options]);
  }, [courses, defaultOption]);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      const params = {
        has_classes: showAllCourses,
      };

      if (courseSelected) {
        params.course_name = courseSelected.value === defaultOption.value
          ? inputCourse : courseSelected.value;
      }
      dispatch(fetchCoursesData(selectedInstitution.id, initialPage, params));
      setInputCourse('');
      setDefaultOption(allResultsOption);
      dispatch(updateFilters(params));
      dispatch(updateCurrentPage(initialPage));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSelected, selectedInstitution, showAllCourses]);

  const isLoading = coursesRequest === RequestStatus.LOADING;

  return (
    <div className="filter-container justify-content-center row">
      <div className="col-11 px-0">
        <h3 className="mb-3">Find  a primary course</h3>
        <Form className="row justify-content-center">
          <Form.Row className="col-12">
            <Form.Group as={Col} className="px-0">
              <Select
                placeholder="Search by keyword, exam code or vendor"
                name="course_name"
                className="mr-2"
                options={courseOptions}
                onChange={option => setCourseSelected(option)}
                value={courseSelected}
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                isClearable
                inputValue={inputCourse}
                onInputChange={handleInputChange}
                filterOption={filterOptions}
                showSearchIcon
                styles={styleFirstOption}
              />
            </Form.Group>
          </Form.Row>
          {
            showCoursesToggle && (
              <Form.Row className="w-100 mt-2">
                <Form.Switch
                  checked={showAllCourses}
                  onChange={handleToggleChange}
                  className="ml-3"
                  disabled={isLoading}
                >
                  Show my courses
                </Form.Switch>
              </Form.Row>
            )
          }
        </Form>
      </div>
    </div>
  );
};

export default CoursesFilters;
