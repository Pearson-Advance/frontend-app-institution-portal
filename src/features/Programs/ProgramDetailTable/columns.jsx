/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Dropdown,
  useToggle,
  IconButton,
  Icon,
  Toast,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';
import { logError } from '@edx/frontend-platform/logging';

import { formatUTCDate, formatInstructorsWithStatus } from 'helpers';

import AddSessionModal from 'features/Sessions/AddSessionModal';
import DeleteModal from 'features/Common/DeleteModal';
import LinkWithQuery from 'features/Main/LinkWithQuery';
import EnrollStudentModal from 'features/Sessions/EnrollStudentModal';

import { sessionModalDeleteText } from 'features/constants';

import { useDeleteSessionMutation } from 'features/Sessions/data/sessionsApi';

import 'assets/global.scss';

const columns = [
  {
    Header: '',
    accessor: 'actions',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const {
        sessionId,
        sessionName,
        startDate,
        endDate,
      } = row.original;

      const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

      const [isOpenEditModal, openEditModal, closeEditModal] = useToggle(false);
      const [isOpenEnrollModal, openEnrollModal, closeEnrollModal] = useToggle(false);
      const [toastMessage, setToastMessage] = useState('');
      const [deletionSessionState, setDeletionSessionState] = useState({
        isModalOpen: false,
        isRequestComplete: false,
      });

      const handleOpenDeleteModal = () => {
        setDeletionSessionState({ isModalOpen: true, isRequestComplete: false });
      };

      const handleResetDeletion = () => {
        setDeletionSessionState({ isModalOpen: false, isRequestComplete: false });
        setToastMessage('');
      };

      const handleDeleteSession = async (id) => {
        try {
          await deleteSession(id).unwrap();
          setToastMessage('Session deleted successfully!');
          setDeletionSessionState({ isModalOpen: false, isRequestComplete: true });
        } catch (error) {
          logError(error);
          setToastMessage(error?.detail || error?.message || 'Session could not be deleted');
          setDeletionSessionState({ isModalOpen: false, isRequestComplete: true });
        }
      };

      return (
        <>
          <Toast
            onClose={handleResetDeletion}
            show={deletionSessionState.isRequestComplete}
            className="toast-message"
          >
            {toastMessage}
          </Toast>
          <Dropdown className="dropdowntpz">
            <Dropdown.Toggle
              id={`dropdown-${sessionId}`}
              as={IconButton}
              src={MoreHoriz}
              iconAs={Icon}
              variant="primary"
              data-testid="dropdown-action"
              alt="menu for actions"
            />
            <Dropdown.Menu popperConfig={{ strategy: 'fixed' }}>
              <Dropdown.Item onClick={openEditModal}>
                <i className="fa-solid fa-pencil mr-2 mb-1" />
                Edit session
              </Dropdown.Item>
              <Dropdown.Item onClick={openEnrollModal}>
                <i className="fa-solid fa-user-plus mr-2" />
                Enroll student
              </Dropdown.Item>
              <Dropdown.Item onClick={handleOpenDeleteModal} className="text-danger">
                <i className="fa-regular fa-trash mr-2 mb-1" />
                Delete session
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <AddSessionModal
            isOpen={isOpenEditModal}
            onClose={closeEditModal}
            sessionData={{
              sessionId,
              sessionName,
              startDate,
              endDate,
            }}
            isEditing
          />

          <EnrollStudentModal
            isOpen={isOpenEnrollModal}
            onClose={closeEnrollModal}
            sessionId={sessionId}
            sessionName={sessionName}
          />

          <DeleteModal
            isLoading={isDeleting}
            isOpen={deletionSessionState.isModalOpen}
            onClose={handleResetDeletion}
            handleDelete={() => handleDeleteSession(sessionId)}
            title={sessionModalDeleteText.title}
            textModal={sessionModalDeleteText.body}
          />
        </>
      );
    },
  },
  {
    Header: 'Session Name',
    accessor: 'sessionName',
    Cell: ({ row }) => {
      const { programId } = useParams();
      return (
        <LinkWithQuery
          to={`/sessions/${encodeURIComponent(row.original.sessionId)}?programId=${encodeURIComponent(programId)}`}
          className="link"
        >
          {row.values.sessionName}
        </LinkWithQuery>
      );
    },
  },
  {
    Header: 'Instructor',
    accessor: 'instructors',
    Cell: ({ row }) => {
      const formattedInstructors = formatInstructorsWithStatus(row.original.instructorsWithStatus);

      if (formattedInstructors && formattedInstructors.length > 0) {
        return (
          <ul className="instructors-list mb-0">
            {formattedInstructors.map((instructorName) => (
              <li key={instructorName}>{instructorName}</li>
            ))}
          </ul>
        );
      }

      return <span className="text-danger">Unassigned</span>;
    },
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
    Cell: ({ row }) => (
      <span>{row.values.numberOfStudents}</span>
    ),
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
];

export { columns };
