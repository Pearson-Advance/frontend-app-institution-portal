import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import { Button } from 'react-paragon-topaz';
import {
  Dropdown, IconButton, Icon, useToggle,
} from '@edx/paragon';
import { MoreVert } from '@edx/paragon/icons';

import AddClass from 'features/Courses/AddClass';
import EnrollStudent from 'features/Classes/EnrollStudent';

const Actions = () => {
  const location = useLocation();
  const history = useHistory();
  const { courseId, classId } = useParams();
  const classes = useSelector((state) => state.classes.allClasses.data);

  const queryParams = new URLSearchParams(location.search);
  const queryClassId = queryParams.get('classId')?.replaceAll(' ', '+');
  const classLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${queryClassId}/home`;

  const [classInfo] = classes.filter(
    (classElement) => classElement.classId === queryClassId,
  );

  const [isOpenEditModal, openEditModal, closeEditModal] = useToggle(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const handleEnrollStudentModal = () => setIsEnrollModalOpen(!isEnrollModalOpen);

  return (
    <>
      <Button
        variant="outline-primary"
        className="text-decoration-none text-primary bg-white mr-3"
        onClick={history.push(`/manage-instructors/${courseId}/${classId}?classId=${queryClassId}`)}
      >
        Manage Instructors
      </Button>
      <Button
        as="a"
        href={classLink}
        target="_blank"
        rel="noopener noreferrer"
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
        isDetailClassPage
      />
      <EnrollStudent isOpen={isEnrollModalOpen} onClose={handleEnrollStudentModal} queryClassId={queryClassId} />
    </>
  );
};

export default Actions;
