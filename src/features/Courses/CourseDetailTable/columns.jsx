/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Dropdown,
  useToggle,
  IconButton,
  Icon,
  Toast,
} from '@edx/paragon';
import { Badge } from 'react-paragon-topaz';
import { MoreHoriz } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import { formatUTCDate, setAssignStaffRole } from 'helpers';

import AddClass from 'features/Courses/AddClass';
import DeleteModal from 'features/Common/DeleteModal';
import LinkWithQuery from 'features/Main/LinkWithQuery';

import { RequestStatus, initialPage } from 'features/constants';

import { deleteClass } from 'features/Courses/data/thunks';
import { fetchClassesData } from 'features/Classes/data/thunks';

import { resetClassState } from 'features/Courses/data/slice';

import 'assets/global.scss';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => {
      const { courseId } = useParams();

      return (
        <LinkWithQuery
          to={`/courses/${courseId}/${encodeURIComponent(row.original.classId)}?previous=courses`}
          className="text-truncate link"
        >
          {row.values.className}
        </LinkWithQuery>
      );
    },
  },
  {
    Header: 'Instructor',
    accessor: 'instructors',
    Cell: ({ row }) => {
      if (row.values.instructors?.length > 0) {
        return (
          <ul className="instructors-list mb-0">
            {row.values.instructors.map(instructor => <li key={instructor} className="text-truncate">{`${instructor}`}</li>)}
          </ul>
        );
      }

      return (
        <span className="text-danger">
          Unassigned
        </span>
      );
    },
  },
  {
    Header: 'Enrollment status',
    accessor: 'numberOfPendingStudents',
    Cell: ({ row }) => {
      const isEnrollmentComplete = row.values.numberOfPendingStudents === 0;

      return isEnrollmentComplete ? (
        <Badge variant="success" light>Complete</Badge>
      ) : (
        <Badge variant="warning" light>Pending ({row.values.numberOfPendingStudents})</Badge>
      );
    },
  },
  {
    Header: 'Min',
    accessor: 'minStudentsAllowed',
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
    Cell: ({ row }) => (
      <span>
        {row.values.numberOfStudents}
      </span>
    ),
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
  },
  {
    Header: 'Start date',
    accessor: 'startDate',
    Cell: ({ row }) => (row.values.startDate ? formatUTCDate(row.values.startDate, 'MM/dd/yy') : '-'),
  },
  {
    Header: 'End date',
    accessor: 'endDate',
    Cell: ({ row }) => (row.values.endDate ? formatUTCDate(row.values.endDate, 'MM/dd/yy') : '-'),
  },
  {
    Header: '',
    accessor: 'courseName',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const {
        masterCourseName,
        masterCourseId,
        classId,
        className,
        startDate,
        endDate,
        minStudentsAllowed,
        maxStudents,
      } = row.original;

      const initialDeletionClassState = {
        isModalOpen: false,
        isRequestComplete: false,
      };

      const dispatch = useDispatch();
      const institution = useSelector((state) => state.main.selectedInstitution);
      const deletionState = useSelector((state) => state.courses.newClass.status);
      const toastMessage = useSelector((state) => state.courses.notificationMessage);

      const [isOpenEditModal, openModal, closeModal] = useToggle(false);
      const [deletionClassState, setDeletionState] = useState(initialDeletionClassState);

      const handleResetDeletion = () => {
        setDeletionState(initialDeletionClassState);
        dispatch(resetClassState());
      };

      const handleOpenDeleteModal = () => {
        dispatch(resetClassState());
        setDeletionState({ isModalOpen: true, isRequestComplete: false });
      };

      const handleDeleteClass = async (rowClassId) => {
        try {
          await dispatch(deleteClass(rowClassId));

          setDeletionState({
            isModalOpen: false,
            isRequestComplete: true,
          });

          await dispatch(fetchClassesData(institution.id, initialPage, masterCourseId));
        } catch (error) {
          logError(error);
        } finally {
          setDeletionState((prevState) => ({
            ...prevState,
            isRequestComplete: true,
          }));
        }
      };

      return (
        <>
          <Dropdown className="dropdowntpz">
            <Dropdown.Toggle
              id="dropdown-toggle-with-iconbutton"
              as={IconButton}
              src={MoreHoriz}
              iconAs={Icon}
              variant="primary"
              data-testid="droprown-action"
              alt="menu for actions"
            />
            <Dropdown.Menu>
              <Dropdown.Item
                target="_blank"
                rel="noreferrer"
                onClick={() => setAssignStaffRole(`${getConfig().LEARNING_MICROFRONTEND_URL}/course/${classId}/home`, classId)}
                className="text-truncate text-decoration-none custom-text-black"
              >
                <i className="fa-regular fa-eye mr-2 mb-1" />
                View class content
              </Dropdown.Item>
              <Dropdown.Item>
                <LinkWithQuery
                  to={`/manage-instructors/${encodeURIComponent(masterCourseId)}/${encodeURIComponent(classId)}`}
                  className="text-truncate text-decoration-none custom-text-black"
                >
                  <i className="fa-regular fa-chalkboard-user mr-2 mb-1" />
                  Manage Instructors
                </LinkWithQuery>
              </Dropdown.Item>
              <Dropdown.Item onClick={openModal}>
                <i className="fa-solid fa-pencil mr-2 mb-1" />
                Edit Class
              </Dropdown.Item>
              <Dropdown.Item onClick={handleOpenDeleteModal} className="text-danger">
                <i className="fa-regular fa-trash mr-2 mb-1" />
                Delete Class
              </Dropdown.Item>
              <AddClass
                isOpen={isOpenEditModal}
                onClose={closeModal}
                courseInfo={{
                  masterCourseName,
                  masterCourseId,
                  classId,
                  className,
                  startDate,
                  endDate,
                  minStudents: minStudentsAllowed,
                  maxStudents,
                }}
                isCoursePage
                isEditing
              />
              <DeleteModal
                isLoading={deletionState === RequestStatus.LOADING}
                isOpen={deletionClassState.isModalOpen}
                onClose={handleResetDeletion}
                handleDelete={() => { handleDeleteClass(classId); }}
                title="Delete this class"
                textModal="This action will permanently delete this class and cannot be undone. Booked seat in this class will not be affected by this action."
              />
            </Dropdown.Menu>
          </Dropdown>
          <Toast
            onClose={handleResetDeletion}
            show={deletionClassState.isRequestComplete}
          >
            {decodeURIComponent(toastMessage)}
          </Toast>
        </>
      );
    },
  },
];

export { columns };
