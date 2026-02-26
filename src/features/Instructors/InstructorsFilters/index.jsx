import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Form, Col, Icon,
} from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';
import { logError } from '@edx/frontend-platform/logging';
import {
  Select, Button, useFormInput, usePreviousValueCompare,
} from 'react-paragon-topaz';

import { fetchInstructorsData } from 'features/Instructors/data/thunks';
import { updateFilters, updateCurrentPage } from 'features/Instructors/data/slice';
import { fetchCoursesOptionsData } from 'features/Courses/data/thunks';

import { initialPage } from 'features/constants';

const initialFilterState = {
  instructorName: '',
  instructorEmail: '',
  courseSelected: null,
  inputType: 'name',
};

const InstructorsFilters = ({ resetPagination, isAssignSection, onResetFilters }) => {
  const dispatch = useDispatch();
  const debounceRef = useRef(null);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const globalFilters = useSelector((state) => state.instructors.filters);
  const courses = useSelector((state) => state.courses.selectOptions);

  const [courseOptions, setCourseOptions] = useState([]);

  const {
    formState, handleInputChange, resetFormState,
  } = useFormInput(initialFilterState);

  const disableSubmitButtons = !formState.instructorEmail
    && !formState.instructorName
    && formState.courseSelected === null;

  const debounceTimeout = isAssignSection ? 250 : 500;

  const resetFields = () => resetFormState();

  const inputConfig = {
    name: {
      label: 'Instructor Name',
      name: 'instructorName',
      placeholder: 'Enter Instructor Name',
      value: formState.instructorName,
      onChange: handleInputChange,
      testId: 'instructorName',
    },
    email: {
      label: 'Instructor Email',
      name: 'instructorEmail',
      placeholder: 'Enter Instructor Email',
      value: formState.instructorEmail,
      onChange: handleInputChange,
      testId: 'instructorEmail',
    },
  };

  const config = inputConfig[formState.inputType] || {};

  const requestPayload = useMemo(() => {
    const filters = {
      email: {
        instructor_email: formState.instructorEmail,
      },
      name: {
        instructor_name: formState.instructorName,
      },
    };

    const payload = {
      ...globalFilters,
      ...filters[formState.inputType],
      course_name: formState.courseSelected?.masterCourseName || '',
    };

    if (isAssignSection) {
      payload.active = true;
    }

    return payload;
  }, [
    formState.instructorEmail,
    formState.instructorName,
    formState.courseSelected,
    formState.inputType,
    isAssignSection,
    globalFilters,
  ]);

  const isSameFiltersData = usePreviousValueCompare(requestPayload);

  const handleCleanFilters = () => {
    dispatch(fetchInstructorsData(
      selectedInstitution?.id,
      initialPage,
    ));

    if (onResetFilters) {
      onResetFilters();
    }

    resetPagination();
    dispatch(updateFilters({}));
    resetFields();
  };

  const handleInstructorsFilters = (e) => {
    e.preventDefault();

    clearTimeout(debounceRef.current);

    /**
     * A manual debounce is implemented to avoid multiple requests.
     */
    debounceRef.current = setTimeout(() => {
      if (isSameFiltersData) { return; }

      dispatch(updateFilters(requestPayload));

      try {
        dispatch(updateCurrentPage(initialPage));
        dispatch(fetchInstructorsData(selectedInstitution?.id, initialPage, requestPayload));
      } catch (error) {
        logError(error);
      }
    }, debounceTimeout);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0 && !isAssignSection) {
      dispatch(fetchCoursesOptionsData(selectedInstitution.id));
    }

    return () => dispatch(updateFilters({}));
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
        {!isAssignSection && <h3>Search</h3>}
        <div className={isAssignSection ? 'py-3' : 'filters'}>
          <Form onSubmit={handleInstructorsFilters}>
            <div
              className={
                `col-12 px-1 d-flex flex-wrap ${isAssignSection
                  ? 'justify-content-between align-items-end'
                  : 'flex-column'
                }`
              }
            >
              <div className={isAssignSection ? 'col-md-8 px-0' : 'col-12 px-0'}>
                <Form.Row className="col-12 px-0 pl-1">
                  <Form.Group>
                    <Form.RadioSet
                      name="inputType"
                      onChange={handleInputChange}
                      value={formState.inputType}
                      isInline
                    >
                      <Form.Radio value="name">Instructor name</Form.Radio>
                      <Form.Radio
                        value="email"
                        data-testid="emailCheckbox"
                        className="ml-0 ml-sm-2"
                      >Instructor email
                      </Form.Radio>
                    </Form.RadioSet>
                  </Form.Group>
                </Form.Row>
                <Form.Row className="col-12 px-0">
                  <Form.Group as={Col} className="pr-0">
                    <Form.Control
                      type="text"
                      className="mr-0"
                      floatingLabel={config.label}
                      name={config.name}
                      placeholder={config.placeholder}
                      onChange={config.onChange}
                      leadingElement={<Icon src={Search} className="mt-2 icon" />}
                      value={config.value}
                      data-testid={config.testId}
                    />
                  </Form.Group>
                </Form.Row>
              </div>

              <Form.Row className="flex-column flex-md-row">
                {!isAssignSection && (
                  <Form.Group as={Col}>
                    <Select
                      placeholder="Course"
                      name="course _name"
                      className="mr-2"
                      options={courseOptions}
                      onChange={option => handleInputChange({ name: 'courseSelected', value: option || {} })}
                      value={formState.courseSelected}
                    />
                  </Form.Group>
                )}

                <div
                  className={`d-flex justify-content-center justify-content-md-end mb-3 ${isAssignSection ? '' : 'col-md-6 mr-1'}`}
                  style={{ gap: '0.5rem' }}
                >
                  <Button
                    onClick={handleCleanFilters}
                    variant="tertiary"
                    text
                    disabled={disableSubmitButtons}
                  >
                    Reset
                  </Button>
                  <Button
                    variant={isAssignSection ? 'outline-primary' : 'primary'}
                    type="submit"
                    disabled={disableSubmitButtons}
                  >
                    Apply
                  </Button>
                </div>
              </Form.Row>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

InstructorsFilters.propTypes = {
  resetPagination: PropTypes.func.isRequired,
  isAssignSection: PropTypes.bool,
  onResetFilters: PropTypes.func,
};

InstructorsFilters.defaultProps = {
  isAssignSection: false,
  onResetFilters: null,
};

export default InstructorsFilters;
