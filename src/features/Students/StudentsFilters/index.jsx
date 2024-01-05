import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { Select, Button } from 'react-paragon-topaz';
import PropTypes from 'prop-types';
import { updateCurrentPage, updateFilters } from 'features/Students/data/slice';
import { fetchCoursesData, fetchClassesData, fetchStudentsData } from 'features/Students/data/thunks';
import { initialPage } from 'features/constants';

const StudentsFilters = ({ resetPagination }) => {
  const dispatch = useDispatch();
  const stateInstitution = useSelector((state) => state.main.institution.data);
  const stateCourses = useSelector((state) => state.students.courses);
  const stateClasses = useSelector((state) => state.students.classes);
  const [courseOptions, setCourseOptions] = useState([]);
  const [classesOptions, setClassesOptions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courseSelected, setCourseSelected] = useState(null);
  const [classSelected, setClassSelected] = useState(null);
  const [statusSelected, setStatusSelected] = useState(null);
  const [examSelected, setExamSelected] = useState(null);
  // check this after implementation of selector institution
  let id = '';
  if (stateInstitution.length === 1) {
    id = stateInstitution[0].id;
  }

  const handleCleanFilters = () => {
    dispatch(fetchStudentsData());
    resetPagination();
    setStudentName('');
    setStudentEmail('');
    setCourseSelected(null);
    setClassSelected(null);
    setStatusSelected(null);
    setExamSelected(null);
    dispatch(updateFilters({}));
  };

  useEffect(() => {
    dispatch(fetchCoursesData(id));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (courseSelected) {
      dispatch(fetchClassesData(id, courseSelected.value));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, courseSelected]);

  useEffect(() => {
    if (stateCourses.data.length > 0) {
      const options = stateCourses.data.map(course => ({
        ...course,
        label: course.masterCourseName,
        value: course.masterCourseName,
      }));
      setCourseOptions(options);
    }
  }, [stateCourses]);

  const handleStudentsFilter = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    dispatch(updateFilters(formJson));
    try {
      dispatch(updateCurrentPage(initialPage));
      dispatch(fetchStudentsData(initialPage, formJson));
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    if (stateClasses.data.length > 0) {
      const options = stateClasses.data.map(ccx => ({
        ...ccx,
        label: ccx.className,
        value: ccx.className,
      }));
      setClassesOptions(options);
    }
  }, [stateClasses]);

  return (
    <div className="filter-container justify-content-center row">
      <div className="col-11 px-0">
        <h3>Search</h3>
        <div className="filters">
          <Form className="row justify-content-center" onSubmit={handleStudentsFilter}>
            <Form.Row className="col-12">
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  floatingLabel="Student Name"
                  name="learner_name"
                  placeholder="Enter Student Name"
                  onChange={(e) => setStudentName(e.target.value)}
                  value={studentName}
                />
              </Form.Group>
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
                  placeholder="Status"
                  name="status"
                  className="mr-2"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'Expired', label: 'Expired' },
                    { value: 'Pending', label: 'Pending' },
                  ]}
                  onChange={option => setStatusSelected(option)}
                  value={statusSelected}
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
