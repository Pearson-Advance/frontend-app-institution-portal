import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import { Button } from 'react-paragon-topaz';
import {
  Dropdown, IconButton, Icon, useToggle,
} from '@edx/paragon';
import { MoreVert } from '@edx/paragon/icons';

import { setAssignStaffRole } from 'helpers';
import { useInstitutionIdQueryParam } from 'hooks';

import AddClass from 'features/Courses/AddClass';
import EnrollStudent from 'features/Classes/EnrollStudent';
import { fetchAllClassesData } from 'features/Classes/data/thunks';

const Actions = ({ previousPage }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { courseId, classId } = useParams();
  const courseIdDecoded = decodeURIComponent(courseId);
  const classIdDecoded = decodeURIComponent(classId);
  const classes = useSelector((state) => state.classes.allClasses.data);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);

  const classLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${classIdDecoded}/home`;

  const [classInfo] = classes.filter(
    (classElement) => classElement.classId === classIdDecoded,
  );

  const [isOpenEditModal, openEditModal, closeEditModal] = useToggle(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const handleEnrollStudentModal = () => setIsEnrollModalOpen(!isEnrollModalOpen);
  const addQueryParam = useInstitutionIdQueryParam();

  const handleManageButton = () => {
    history.push(addQueryParam(`/manage-instructors/${courseId}/${classId}?previous=${previousPage}`));
  };

  const finalCall = () => {
    dispatch(fetchAllClassesData(selectedInstitution.id, courseIdDecoded));
  };

  return (
    <>
      <Button
        variant="outline-primary"
        className="text-decoration-none text-primary bg-white mr-3"
        onClick={handleManageButton}
      >
        Manage Instructors
      </Button>
      <Button
        as="a"
        onClick={() => setAssignStaffRole(classLink, classIdDecoded)}
        className="text-decoration-none text-white button-view-class mr-3"
      >
        <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
        View class content
      </Button>
      <Dropdown className="dropdowntpz">
        <Dropdown.Toggle
          id="dropdown-toggle-with-iconbutton"
          as={IconButton}
          src={MoreVert}
          iconAs={Icon}
          variant="primary"
          data-testid="droprown-action"
          alt="menu for actions"
        />
        <Dropdown.Menu>
          <Dropdown.Item onClick={openEditModal}>
            <i className="fa-regular fa-pencil mr-2 mb-1" />
            Edit Class
          </Dropdown.Item>
          <Dropdown.Item onClick={handleEnrollStudentModal}>
            <i className="fa-regular fa-user-plus mr-2 mb-1" />
            Invite student to enroll
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <AddClass
        isOpen={isOpenEditModal}
        onClose={closeEditModal}
        courseInfo={{
          masterCourseName: classInfo?.masterCourseName,
          classId: classInfo?.classId,
          className: classInfo?.className,
          startDate: classInfo?.startDate,
          endDate: classInfo?.endDate,
          minStudents: classInfo?.minStudentsAllowed,
          maxStudents: classInfo?.maxStudents,
        }}
        isEditing
        finalCall={finalCall}
      />
      <EnrollStudent isOpen={isEnrollModalOpen} onClose={handleEnrollStudentModal} />
    </>
  );
};

Actions.propTypes = {
  previousPage: PropTypes.string,
};

Actions.defaultProps = {
  previousPage: 'courses',
};

export default Actions;
