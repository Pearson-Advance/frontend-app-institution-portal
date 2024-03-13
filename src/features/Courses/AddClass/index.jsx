import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  FormGroup, ModalDialog, Form, ModalCloseButton, Toast, Col,
} from '@edx/paragon';
import { Button, Select } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { addClass } from 'features/Courses/data/thunks';
import { fetchInstructorsOptionsData } from 'features/Instructors/data/thunks';
import { fetchClassesData } from 'features/Classes/data/thunks';
import { updateCurrentPage } from 'features/Courses/data/slice';

import { initialPage } from 'features/constants';

import 'features/Courses/AddClass/index.scss';

const AddClass = ({ isOpen, onClose, courseInfo }) => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const instructorsList = useSelector((state) => state.instructors.selectOptions);
  const notificationMsg = useSelector((state) => state.courses.notificationMessage);
  const [showToast, setShowToast] = useState(false);
  const [instructorsOptions, setInstructorsOptions] = useState([]);
  const [instructorSelected, setInstructorSelected] = useState(null);
  const [className, setClassName] = useState('');
  const [minStudents, setMinStudents] = useState('');
  const [maxStudents, setMaxStudents] = useState('');

  const handleAddClass = async (e) => {
    e.preventDefault();
    const form = e.target;
    const dataCreateClass = new FormData(form);
    const classNameField = dataCreateClass.get('name');
    const startDate = dataCreateClass.get('start_date');
    const endDate = dataCreateClass.get('end_date');
    dataCreateClass.append('course_id', courseInfo.masterCourseId);
    dataCreateClass.set('start_date', startDate ? new Date(startDate).toISOString() : '');
    dataCreateClass.set('end_date', endDate ? new Date(endDate).toISOString() : '');

    if (!classNameField || !startDate) {
      return onClose();
    }

    try {
      const enrollmentDataInst = new FormData();
      if (instructorSelected) {
        enrollmentDataInst.append('unique_student_identifier', instructorSelected.value);
        enrollmentDataInst.append('rolename', 'staff');
        enrollmentDataInst.append('action', 'allow');
      }
      await dispatch(addClass(dataCreateClass, enrollmentDataInst));
      onClose();
      setShowToast(true);
    } catch (error) {
      logError(error);
    } finally {
      dispatch(fetchClassesData(selectedInstitution.id, initialPage, courseId));
      dispatch(updateCurrentPage(initialPage));
    }
    return null;
  };

  const resetFields = () => {
    setClassName('');
    setInstructorSelected(null);
    setMinStudents('');
    setMaxStudents('');
  };

  const handleNumericField = (e, field) => {
    const { value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === '' || regex.test(value)) {
      return field === 'min' ? setMinStudents(value) : setMaxStudents(value);
    }

    return null;
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0 && isOpen) {
      dispatch(fetchInstructorsOptionsData(selectedInstitution.id, initialPage, { limit: false }));
    }
  }, [selectedInstitution, isOpen, dispatch]);

  useEffect(() => {
    if (instructorsList.length > 0) {
      const options = instructorsList.map(instructor => ({
        ...instructor,
        label: instructor.instructorName,
        value: instructor.instructorUsername,
      }));
      setInstructorsOptions(options);
    }
  }, [instructorsList]);

  useEffect(() => {
    if (!isOpen) {
      resetFields();
    }
  }, [isOpen]);

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
      >
        {notificationMsg}
      </Toast>
      <ModalDialog
        title="Add Class"
        isOpen={isOpen}
        onClose={onClose}
        hasCloseButton
        size="md"
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Add Class
          </ModalDialog.Title>
          <p className="course-name my-1">
            {courseInfo?.masterCourseName}
          </p>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Form onSubmit={handleAddClass}>
            <FormGroup controlId="instructorInfo">
              <Form.Control
                type="text"
                placeholder="Class name / Title *"
                floatingLabel="Class name / Title *"
                className="my-1 mr-0"
                name="name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </FormGroup>
            <Form.Group as={Col} className="px-0">
              <Select
                placeholder="Instructor"
                name="instructor"
                options={instructorsOptions}
                onChange={option => setInstructorSelected(option)}
                value={instructorSelected}
              />
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  type="date"
                  placeholder="Start date *"
                  floatingLabel="Start date *"
                  className="my-1 mr-0"
                  name="start_date"
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  type="date"
                  placeholder="End date"
                  floatingLabel="End date"
                  className="my-1 mr-0"
                  name="end_date"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  placeholder="Minimum enrollment"
                  floatingLabel="Minimum enrollment"
                  className="my-1 mr-0"
                  name="min_students_allowed"
                  value={minStudents}
                  onChange={e => handleNumericField(e, 'min')}
                  pattern="[0-9]*"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  placeholder="Maximum enrollment"
                  floatingLabel="Maximum enrollment"
                  className="my-1 mr-0"
                  name="max_student_enrollments"
                  value={maxStudents}
                  onChange={e => handleNumericField(e, 'max')}
                />
              </Form.Group>
            </Form.Row>
            <div className="d-flex justify-content-end">
              <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2">Cancel</ModalCloseButton>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </ModalDialog.Body>
      </ModalDialog>
    </>

  );
};

AddClass.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  courseInfo: PropTypes.shape({
    masterCourseName: PropTypes.string,
    masterCourseId: PropTypes.string,
  }).isRequired,
};

export default AddClass;
