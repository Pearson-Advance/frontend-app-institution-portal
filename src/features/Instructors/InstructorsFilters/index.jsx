import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Form, Col, Icon,
} from '@edx/paragon';
import { Search } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';
import { Select, Button, useFormInput } from 'react-paragon-topaz';

import { fetchInstructorsData } from 'features/Instructors/data/thunks';
import { updateFilters, updateCurrentPage } from 'features/Instructors/data/slice';
import { fetchCoursesOptionsData } from 'features/Courses/data/thunks';

import { initialPage } from 'features/constants';

const initialFilterState = {
  instructorName: '',
  instructorEmail: '',
  courseSelected: null,
  inputType: 'name',
  active: null,
};

const switchLabels = {
  true: 'Active',
  false: 'Inactive',
  null: 'All',
};

const InstructorsFilters = ({ resetPagination, isAssignSection }) => {
  const dispatch = useDispatch();
  const debounceRef = useRef(null);
  const { SHOW_INSTRUCTOR_FEATURES = false } = getConfig() || {};
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const courses = useSelector((state) => state.courses.selectOptions);

  const [courseOptions, setCourseOptions] = useState([]);

  const { formState, handleInputChange, resetFormState } = useFormInput(initialFilterState);

  const disableSubmitButtons = formState.active === null
  && !formState.instructorEmail
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

  const handleCleanFilters = () => {
    const requestPayload = isAssignSection ? { active: true } : undefined;

    dispatch(fetchInstructorsData(
      selectedInstitution?.id,
      initialPage,
      requestPayload,
    ));

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
      const {
        instructorName,
        instructorEmail,
        courseSelected,
        inputType,
      } = formState;

      const filters = {
        email: {
          instructor_email: instructorEmail,
        },
        name: {
          instructor_name: instructorName,
        },
      };

      const requestPayload = {
        ...filters[inputType],
        course_name: courseSelected?.masterCourseName || '',
      };

      if (SHOW_INSTRUCTOR_FEATURES) {
        requestPayload.active = formState.active;
      }

      if (isAssignSection) {
        requestPayload.active = true;
      }

      dispatch(updateFilters(filters));

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
                {
                   (!isAssignSection && SHOW_INSTRUCTOR_FEATURES) && (
                   <Form.Row className="mb-3">
                     <Form.Switch
                       name="active"
                       checked={formState.active}
                       onChange={handleInputChange}
                       indeterminate={formState.active === null}
                     >
                       Instructor status: {switchLabels[formState.active]}
                     </Form.Switch>
                   </Form.Row>
                   )
                }
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
};

InstructorsFilters.defaultProps = {
  isAssignSection: false,
};

export default InstructorsFilters;
