import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-paragon-topaz';
import { getConfig } from '@edx/frontend-platform';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Icon,
  Dropdown,
  useToggle,
  IconButton,
  Toast,
} from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import { logError } from '@edx/frontend-platform/logging';

import { setAssignStaffRole } from 'helpers';
import { useInstitutionIdQueryParam, useToast } from 'hooks';
import { RequestStatus, modalDeleteText } from 'features/constants';

import AddClass from 'features/Courses/AddClass';
import DeleteModal from 'features/Common/DeleteModal';
import EnrollStudent from 'features/Classes/EnrollStudent';

import { resetClassState } from 'features/Courses/data/slice';
import { deleteClass } from 'features/Courses/data/thunks';
import { fetchAllClassesData, fetchLabSummaryLink } from 'features/Classes/data/thunks';

const initialDeletionClassState = {
  isModalOpen: false,
  isRequestComplete: false,
};

const Actions = ({ previousPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId, classId } = useParams();
  const courseIdDecoded = decodeURIComponent(courseId);
  const classIdDecoded = decodeURIComponent(classId);
  const classes = useSelector((state) => state.classes.allClasses.data);
  const deletionState = useSelector((state) => state.courses.newClass.status);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const gradebookUrl = getConfig().GRADEBOOK_MICROFRONTEND_URL || getConfig().LMS_BASE_URL;
  const {
    isVisible,
    message,
    showToast,
    hideToast,
  } = useToast();

  const [deletionClassState, setDeletionState] = useState(initialDeletionClassState);

  const classLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${classIdDecoded}/home`;

  const [classInfo] = classes.filter(
    (classElement) => classElement.classId === classIdDecoded,
  );

  const [isOpenEditModal, openEditModal, closeEditModal] = useToggle(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  let instructorText = 'Assign instructor';

  if (classInfo?.instructors?.length > 1) {
    instructorText = 'Manage instructors';
  } else if (classInfo?.instructors?.length === 1) {
    instructorText = 'Manage instructor';
  }

  const addQueryParam = useInstitutionIdQueryParam();

  const handleEnrollStudentModal = () => setIsEnrollModalOpen(!isEnrollModalOpen);

  const handleManageButton = () => {
    navigate(addQueryParam(`/manage-instructors/${courseId}/${classId}?previous=${previousPage}`));
  };

  const handleGradebookButton = () => {
    window.open(`${gradebookUrl}/gradebook/${classIdDecoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleResetDeletion = () => {
    setDeletionState(initialDeletionClassState);
    dispatch(resetClassState());
  };

  const handleOpenDeleteModal = () => {
    dispatch(resetClassState());
    setDeletionState({ isModalOpen: true, isRequestComplete: false });
  };

  const handleDeleteClass = async () => {
    try {
      await dispatch(deleteClass(classIdDecoded));

      setDeletionState({
        isModalOpen: false,
        isRequestComplete: true,
      });

      navigate('/classes');
    } catch (error) {
      logError(error);
    } finally {
      setDeletionState((prevState) => ({
        ...prevState,
        isRequestComplete: true,
      }));
    }
  };

  const handleLabSummary = () => {
    dispatch(fetchLabSummaryLink(classIdDecoded, classInfo.labSummaryTag, (dashboardMessage) => {
      showToast(dashboardMessage);
    }));
  };

  const finalCall = () => {
    dispatch(fetchAllClassesData(selectedInstitution.id, courseIdDecoded));
  };

  return (
    <>
      <Toast
        onClose={hideToast}
        show={isVisible}
        className="toast-message"
        data-testid="toast-message"
      >
        {message}
      </Toast>
      <Button
        onClick={handleEnrollStudentModal}
        className="text-decoration-none text-white button-view-class mr-3"
      >
        Invite students to enroll
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
          <Dropdown.Item onClick={() => setAssignStaffRole(classLink, classIdDecoded)}>
            <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
            Class content
          </Dropdown.Item>
          <Dropdown.Item onClick={handleManageButton}>
            <i className="fa-regular fa-chalkboard-user mr-2 mb-1" />
            {instructorText}
          </Dropdown.Item>
          <Dropdown.Item onClick={openEditModal}>
            <i className="fa-regular fa-pencil mr-2 mb-1" />
            Edit class
          </Dropdown.Item>
          <Dropdown.Item onClick={handleGradebookButton}>
            <i className="fa-regular fa-book mr-2 mb-1" />
            Gradebook
          </Dropdown.Item>
          {classInfo?.labSummaryTag && (
            <Dropdown.Item onClick={handleLabSummary}>
              <i className="fa-regular fa-rectangle-list mr-2" />
              Lab Dashboard
            </Dropdown.Item>
          )}
          <Dropdown.Item onClick={handleOpenDeleteModal} className="text-danger">
            <i className="fa-regular fa-trash mr-2 mb-1" />
            Delete class
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
      <DeleteModal
        isLoading={deletionState === RequestStatus.LOADING}
        isOpen={deletionClassState.isModalOpen}
        onClose={handleResetDeletion}
        handleDelete={() => { handleDeleteClass(classId); }}
        title={modalDeleteText.title}
        textModal={modalDeleteText.body}
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
