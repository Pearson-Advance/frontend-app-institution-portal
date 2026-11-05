/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Dropdown,
  IconButton,
  Icon,
  Toast,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';
import { logError } from '@edx/frontend-platform/logging';
import { Badge } from 'react-paragon-topaz';

import { formatUTCDate } from 'helpers';

import LinkWithQuery from 'features/Main/LinkWithQuery';
import DeleteModal from 'features/Common/DeleteModal';
import { sessionModalDeleteText } from 'features/constants';

import {
  useDeleteSessionMutation,
} from 'features/Sessions/data/sessionsApi';

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
        hidden,
      } = row.original;

      const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

      const [toastConfig, setToastConfig] = useState({ show: false, message: '' });
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await deleteSession(sessionId).unwrap();
          setIsDeleteModalOpen(false);
          setToastConfig({
            show: true,
            message: 'Session deleted successfully.',
          });
        } catch (error) {
          logError(error);
          setIsDeleteModalOpen(false);
          setToastConfig({
            show: true,
            message: error?.detail || error?.message || 'Could not delete session.',
          });
        }
      };

      return (
        <>
          <Toast
            onClose={() => setToastConfig({ show: false, message: '' })}
            show={toastConfig.show}
            className="toast-message"
          >
            {toastConfig.message}
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
              <Dropdown.Item>
                <LinkWithQuery
                  to={`/sessions/${encodeURIComponent(sessionId)}`}
                  className="text-truncate text-decoration-none custom-text-black"
                >
                  <i className="fa-regular fa-eye mr-2 mb-1" />
                  View classes
                </LinkWithQuery>
              </Dropdown.Item>

              <Dropdown.Item>
                <i className={`fa-regular ${hidden ? 'fa-eye' : 'fa-eye-slash'} mr-2 mb-1`} />
                {hidden ? 'Show session' : 'Hide session'}
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-danger"
              >
                <i className="fa-regular fa-trash mr-2 mb-1" />
                Delete session
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <DeleteModal
            isLoading={isDeleting}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            handleDelete={handleDelete}
            title={sessionModalDeleteText?.title || 'Delete Session'}
            textModal={sessionModalDeleteText?.body || 'Are you sure you want to delete this session?'}
          />
        </>
      );
    },
  },
  {
    Header: 'Session',
    accessor: 'sessionName',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/sessions/${encodeURIComponent(row.original.sessionId)}`}
        className="link"
      >
        {row.values.sessionName}
      </LinkWithQuery>
    ),
  },
  {
    Header: 'Program',
    accessor: 'programName',
    Cell: ({ row }) => <span>{row.values.programName || '-'}</span>,
  },
  {
    Header: 'Instructor',
    accessor: 'missingClassesForInstructor',
    Cell: ({ row }) => (
      row.values.missingClassesForInstructor > 0
        ? <Badge variant="danger" light>Missing ({row.values.missingClassesForInstructor})</Badge>
        : <Badge variant="success" light>Ready</Badge>
    ),
  },
  {
    Header: 'Min',
    accessor: 'minStudentsAllowed',
    Cell: ({ row }) => <span>{row.values.minStudentsAllowed ?? '-'}</span>,
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
    Cell: ({ row }) => <span>{row.values.maxStudents ?? '-'}</span>,
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
    Cell: ({ row }) => <span>{row.values.numberOfStudents ?? 0}</span>,
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
    Header: 'Status',
    accessor: 'hidden',
    Cell: ({ row }) => (
      <span>{row.original.hidden ? 'Hidden' : 'Visible'}</span>
    ),
  },
];

export { columns };
