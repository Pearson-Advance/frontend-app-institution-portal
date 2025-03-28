import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  FormGroup,
  ModalDialog,
  Form,
  ModalCloseButton,
  Toast,
  Col,
} from '@edx/paragon';

import { Button, Select } from 'react-paragon-topaz';
import { camelCaseObject } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import { addClass, editClass } from 'features/Courses/data';
import { fetchInstructorsOptionsData } from 'features/Instructors/data/thunks';

import { initialPage } from 'features/constants';
import { formatUTCDate } from 'helpers';

import 'features/Courses/AddClass/index.scss';

const AddClass = ({
  isOpen, onClose, courseInfo, isEditing, finalCall,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const instructorsList = useSelector((state) => state.instructors.selectOptions.data);
  const notificationMsg = useSelector((state) => state.courses.notificationMessage);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [instructorsOptions, setInstructorsOptions] = useState([]);
  const [instructorSelected, setInstructorSelected] = useState(null);
  const [className, setClassName] = useState('');
  const [minStudents, setMinStudents] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddClass = async (e) => {
    e.preventDefault();
    const form = e.target;
    const dataClass = new FormData(form);
    const classNameField = dataClass.get('name');
    dataClass.set('start_date', startDate ? new Date(startDate).toISOString() : '');
    dataClass.set('end_date', endDate ? new Date(endDate).toISOString() : '');

    if (!classNameField || !startDate) {
      return onClose();
    }

    setIsLoading(true);

    if (isLoading) {
      return null;
    }

    if (isEditing) {
      try {
        dataClass.append('class_id', courseInfo.classId);
        await dispatch(editClass(dataClass));
        onClose();
        setShowToast(true);
      } catch (error) {
        logError(error);
      } finally {
        finalCall();
      }
    } else {
      try {
        dataClass.append('course_id', courseInfo.masterCourseId);
        dataClass.append('institution_id', selectedInstitution.id);
        dataClass.append('license_id', courseInfo?.licenseId);
        const enrollmentDataInst = new FormData();
        if (instructorSelected) {
          enrollmentDataInst.append('unique_student_identifier', instructorSelected.value);
          enrollmentDataInst.append('rolename', 'staff');
          enrollmentDataInst.append('action', 'allow');
        }

        const response = await dispatch(addClass(dataClass, enrollmentDataInst));
        const classInfo = camelCaseObject(response?.data);

        onClose();
        setShowToast(true);

        if (classInfo.classId) {
          history.push(`/courses/${encodeURIComponent(courseInfo.masterCourseId)}/${encodeURIComponent(classInfo?.classId)}?previous=classes`);
        }
      } catch (error) {
        logError(error);
      } finally {
        finalCall();
      }
    }

    setIsLoading(false);
    return null;
  };

  const resetFields = () => {
    setClassName('');
    setInstructorSelected(null);
    setMinStudents('');
    setMaxStudents('');
    setStartDate('');
    setEndDate('');
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
    if (Object.keys(selectedInstitution).length > 0 && isOpen && !isEditing) {
      dispatch(fetchInstructorsOptionsData(selectedInstitution.id, initialPage, { limit: false }));
    }
  }, [selectedInstitution, isOpen, dispatch, isEditing]);

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

  useEffect(() => {
    if (isEditing && Object.keys(courseInfo).length > 2) {
      const formattedStartDate = courseInfo?.startDate ? formatUTCDate(courseInfo?.startDate, 'yyyy-MM-dd') : '';
      const formattedEndDate = courseInfo?.endDate ? formatUTCDate(courseInfo?.endDate, 'yyyy-MM-dd') : '';
      setClassName(courseInfo?.className);
      setMinStudents(courseInfo?.minStudents ? courseInfo?.minStudents : '');
      setMaxStudents(courseInfo?.maxStudents ? courseInfo?.maxStudents : '');
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    }
  }, [courseInfo, isEditing]);

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
      >
        {decodeURIComponent(notificationMsg)}
      </Toast>
      <ModalDialog
        title={isEditing ? 'Edit Class' : 'Add Class'}
        isOpen={isOpen}
        onClose={onClose}
        hasCloseButton
        size="md"
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {isEditing ? 'Edit Class' : 'Add Class'}
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
            {!isEditing && (
              <Form.Group as={Col} className="px-0">
                <Select
                  placeholder="Instructor"
                  name="instructor"
                  options={instructorsOptions}
                  onChange={option => setInstructorSelected(option)}
                  value={instructorSelected}
                />
              </Form.Group>
            )}
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  type="date"
                  placeholder="Start date *"
                  floatingLabel="Start date *"
                  className="my-1 mr-0"
                  name="start_date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  type="date"
                  placeholder="End date"
                  floatingLabel="End date"
                  className="my-1 mr-0"
                  name="end_date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
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
              <Button type="submit" disabled={isLoading}>Submit</Button>
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
    masterCourseName: PropTypes.string.isRequired,
    masterCourseId: PropTypes.string,
    classId: PropTypes.string,
    className: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    minStudents: PropTypes.number,
    maxStudents: PropTypes.number,
    licenseId: PropTypes.number,
  }).isRequired,
  isEditing: PropTypes.bool,
  finalCall: PropTypes.func.isRequired,
};

AddClass.defaultProps = {
  isEditing: false,
};

export default AddClass;
