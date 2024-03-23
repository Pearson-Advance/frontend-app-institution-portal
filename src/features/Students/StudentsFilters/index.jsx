import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { Select, Button } from 'react-paragon-topaz';
import PropTypes from 'prop-types';
import { updateCurrentPage, updateFilters } from 'features/Students/data/slice';
import { fetchStudentsData } from 'features/Students/data/thunks';
import { fetchCoursesOptionsData } from 'features/Courses/data/thunks';
import { fetchClassesOptionsData } from 'features/Classes/data/thunks';
import { initialPage } from 'features/constants';

const StudentsFilters = ({ resetPagination }) => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const courses = useSelector((state) => state.courses.selectOptions);
  const classes = useSelector((state) => state.classes.selectOptions);
  const [courseOptions, setCourseOptions] = useState([]);
  const [classesOptions, setClassesOptions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courseSelected, setCourseSelected] = useState(null);
  const [classSelected, setClassSelected] = useState(null);
  const [examSelected, setExamSelected] = useState(null);
  const [inputFieldDisplay, setInputFieldDisplay] = useState('name');

  const resetFields = () => {
    setStudentName('');
    setStudentEmail('');
    setCourseSelected(null);
    setClassSelected(null);
    setExamSelected(null);
  };

  const handleCleanFilters = () => {
    dispatch(fetchStudentsData(selectedInstitution.id));
    resetPagination();
    dispatch(updateFilters({}));
    resetFields();
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      resetFields();
      dispatch(fetchCoursesOptionsData(selectedInstitution.id));
    }
  }, [selectedInstitution, dispatch]);

  useEffect(() => {
    if (courseSelected) {
      dispatch(fetchClassesOptionsData(selectedInstitution.id, courseSelected.value));
    }
  }, [selectedInstitution, courseSelected, dispatch]);

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

  const handleStudentsFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    dispatch(updateFilters(formJson));
    try {
      dispatch(updateCurrentPage(initialPage));
      dispatch(fetchStudentsData(selectedInstitution.id, initialPage, formJson));
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    const options = classes.length > 0
      ? classes.map(ccx => ({
        ...ccx,
        label: ccx.className,
        value: ccx.className,
      }))
      : [];
    setClassesOptions(options);
  }, [classes]);

  return (
    <div className="filter-container justify-content-center row">
      <div className="col-11 px-0">
        <h3>Search</h3>
        <div className="filters">
          <Form className="row justify-content-center" onSubmit={handleStudentsFilter}>
            <Form.Row className="col-12">
              <Form.Group>
                <Form.RadioSet
                  name="inputField"
                  onChange={(e) => setInputFieldDisplay(e.target.value)}
                  defaultValue="name"
                  isInline
                >
                  <Form.Radio value="name">Student name</Form.Radio>
                  <Form.Radio value="email" data-testid="emailCheckbox">Student email</Form.Radio>
                </Form.RadioSet>
              </Form.Group>
            </Form.Row>
            <Form.Row className="col-12">
              {inputFieldDisplay === 'name' && (
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  floatingLabel="Student Name"
                  name="learner_name"
                  placeholder="Enter Student Name"
                  data-testid="learnerName"
                  onChange={(e) => setStudentName(e.target.value)}
                  value={studentName}
                />
              </Form.Group>
              )}
              {inputFieldDisplay === 'email' && (
              <Form.Group as={Col}>
                <Form.Control
                  type="email"
                  floatingLabel="Student Email"
                  name="learner_email"
                  placeholder="Enter Student Email"
                  onChange={(e) => setStudentEmail(e.target.value)}
                  value={studentEmail}
                />
              </Form.Group>
              )}
            </Form.Row>
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
              <Form.Group as={Col}>
                <Select
                  placeholder="Class"
                  className="mr-2"
                  name="class_name"
                  isDisabled={!courseSelected}
                  options={classesOptions}
                  onChange={option => setClassSelected(option)}
                  value={classSelected}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Select
                  placeholder="Exam ready"
                  name="exam_ready"
                  className="mr-2"
                  options={[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ]}
                  onChange={option => setExamSelected(option)}
                  value={examSelected}
                />
              </Form.Group>
            </Form.Row>
            <div className="d-flex col-12 justify-content-end mr-3">
              <Button onClick={handleCleanFilters} variant="tertiary" text className="mr-2">Reset</Button>
              <Button type="submit">Apply</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

StudentsFilters.propTypes = {
  resetPagination: PropTypes.func.isRequired,
};

export default StudentsFilters;
