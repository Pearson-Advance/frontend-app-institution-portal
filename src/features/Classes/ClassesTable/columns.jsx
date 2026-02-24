/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dropdown,
  IconButton,
  Icon,
  useToggle,
  Toast,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import { useToast } from 'hooks';
import AddClass from 'features/Courses/AddClass';
import DeleteModal from 'features/Common/DeleteModal';
import LinkWithQuery from 'features/Main/LinkWithQuery';
import EnrollStudent from 'features/Classes/EnrollStudent';

import { RequestStatus, initialPage, modalDeleteText } from 'features/constants';

import { deleteClass } from 'features/Courses/data/thunks';
import { fetchClassesData, fetchLabSummaryLink, supersetUrlClassesDashboard } from 'features/Classes/data/thunks';

import { formatUTCDate, setAssignStaffRole } from 'helpers';
import { resetClassState } from 'features/Courses/data/slice';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/courses/${encodeURIComponent(row.original.masterCourseId)}/${encodeURIComponent(row.original.classId)}?previous=classes`}
        className="text-truncate link"
      >
        {row.values.className}
      </LinkWithQuery>
    ),
  },
  {
    Header: 'Course Title',
    accessor: 'masterCourseName',
    Cell: ({ row }) => (
      <span className="text-truncate">
        {row.original.masterCourseName}
      </span>
    ),
  },
  {
    Header: 'Instructor',
    accessor: 'instructors',
    Cell: ({ row }) => {
      const instructorInfo = useSelector((state) => state.instructors.selectOptions.data);

      if (row.values.instructors?.length > 0) {
        return (
          <ul className="instructors-list mb-0">

            {row.values.instructors.map(instructorUsername => {
              const instructorData = instructorInfo.find(
                instructor => instructor.instructorUsername === instructorUsername,
              );

              return (
                <li key={instructorUsername} className="text-truncate">
                  {instructorData?.instructorName || instructorUsername}
                </li>
              );
            })}
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
    Header: 'Min',
    accessor: 'minStudentsAllowed',
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Start Date',
    accessor: 'startDate',
    Cell: ({ row }) => (row.values.startDate ? formatUTCDate(row.values.startDate, 'MM/dd/yy') : '-'),
  },
  {
    Header: 'End Date',
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
        labSummaryTag,
      } = row.original;

      const initialDeletionClassState = {
        isModalOpen: false,
        isRequestComplete: false,
      };

      const dispatch = useDispatch();
      const institution = useSelector((state) => state.main.selectedInstitution);
      const deletionState = useSelector((state) => state.courses.newClass.status);
      const [isOpenModal, openModal, closeModal] = useToggle(false);
      const [isOpenEnrollModal, openEnrollModal, closeEnrollModal] = useToggle(false);
      const [deletionClassState, setDeletionState] = useState(initialDeletionClassState);
      const gradebookUrl = getConfig().GRADEBOOK_MICROFRONTEND_URL || getConfig().LMS_BASE_URL;
      const {
        isVisible,
        message,
        showToast,
        hideToast,
      } = useToast();

      const handleResetDeletion = () => {
        setDeletionState(initialDeletionClassState);
        dispatch(resetClassState());
      };
      const handleOpenDeleteModal = () => {
        dispatch(resetClassState());
        setDeletionState({ isModalOpen: true, isRequestComplete: false });
      };

      const handleGradebookButton = () => {
        window.open(`${gradebookUrl}/gradebook/${classId}`, '_blank', 'noopener,noreferrer');
      };

      const handleDeleteClass = async (rowClassId) => {
        try {
          await dispatch(deleteClass(rowClassId));

          setDeletionState({
            isModalOpen: false,
            isRequestComplete: true,
          });

          await dispatch(fetchClassesData(institution.id, initialPage));
        } catch (error) {
          logError(error);
        } finally {
          setDeletionState((prevState) => ({
            ...prevState,
            isRequestComplete: true,
          }));
        }
      };

      const [classesDashboardUrl, setClassesDashboardUrl] = useState(null);

      useEffect(() => {
        let isMounted = true;

        async function fetchSupersetDashboardUrl() {
          const url = await supersetUrlClassesDashboard(
            classId,
            getConfig().CLASSES_INSIGHTS_FLAG,
          );
          if (isMounted) {
            setClassesDashboardUrl(url);
          }
        }

        fetchSupersetDashboardUrl();

        return () => {
          isMounted = false;
        };
      }, [classId]);

      const handleLabSummary = () => {
        dispatch(fetchLabSummaryLink(classId, labSummaryTag, (dashboardMessage) => {
          showToast(dashboardMessage);
        }));
      };

      const finalCall = () => {
        dispatch(fetchClassesData(institution.id, initialPage));
      };

      return (
        <Dropdown className="dropdowntpz">
          <Toast
            onClose={hideToast}
            show={isVisible}
            className="toast-message"
            data-testid="toast-message"
          >
            {message}
          </Toast>
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
            <Dropdown.Item onClick={openEnrollModal}>
              <i className="fa-solid fa-user-plus mr-2" />
              Enroll student
            </Dropdown.Item>
            <Dropdown.Item onClick={handleGradebookButton}>
              <i className="fa-regular fa-book mr-2 mb-1" />
              Gradebook
            </Dropdown.Item>
            {classesDashboardUrl && (
              <Dropdown.Item
                as="a"
                href={classesDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-truncate text-decoration-none custom-text-black"
              >
                <i className="fa-regular fa-chart-bar mr-2 mb-1" />
                Classes Insights (Beta)
              </Dropdown.Item>
            )}
            {labSummaryTag && (
              <Dropdown.Item onClick={handleLabSummary}>
                <i className="fa-regular fa-rectangle-list mr-2" />
                Lab Dashboard
              </Dropdown.Item>
            )}
            <Dropdown.Item onClick={handleOpenDeleteModal} className="text-danger">
              <i className="fa-regular fa-trash mr-2 mb-1" />
              Delete Class
            </Dropdown.Item>
            <AddClass
              isOpen={isOpenModal}
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
          </Dropdown.Menu>
          <EnrollStudent
            isOpen={isOpenEnrollModal}
            onClose={() => {
              closeEnrollModal();
              finalCall();
            }}
            customClassId={classId}
            classNameDisplay={className}
          />
        </Dropdown>
      );
    },
  },
];

export { columns };
