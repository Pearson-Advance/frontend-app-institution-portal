/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
  useEditSessionMutation,
} from 'features/Sessions/data/sessionsApi';

import 'assets/global.scss';

const SessionActions = ({ row }) => {
  const institution = useSelector((state) => state.main.selectedInstitution);

  const {
    id,
    offeringId,
    hidden,
  } = row.original;

  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();
  const [editSession, { isLoading: isUpdatingVisibility }] = useEditSessionMutation();

  const [toastConfig, setToastConfig] = useState({ show: false, message: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleToggleVisibility = async () => {
    const newHiddenState = !hidden;

    try {
      await editSession({
        data: {
          offering_run_id: id,
          offering_id: offeringId,
          hidden: newHiddenState,
        },
        params: {
          institution_id: institution?.id,
        },
      }).unwrap();

      setToastConfig({
        show: true,
        message: newHiddenState
          ? 'Session hidden successfully.'
          : 'Session is now visible.',
      });
    } catch (error) {
      logError(error);
      setToastConfig({
        show: true,
        message: error?.data?.detail || error?.message || 'Could not update session visibility.',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSession(id).unwrap();
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
          id={`dropdown-${id}`}
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
              to={`/sessions/${encodeURIComponent(id)}`}
              className="text-truncate text-decoration-none custom-text-black"
            >
              <i className="mb-1 mr-2 fa-regular fa-eye" />
              View classes
            </LinkWithQuery>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={handleToggleVisibility}
            disabled={isUpdatingVisibility}
          >
            <i className={`fa-regular ${hidden ? 'fa-eye' : 'fa-eye-slash'} mr-2 mb-1`} />
            {hidden ? 'Show session' : 'Hide session'}
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-danger"
          >
            <i className="mb-1 mr-2 fa-regular fa-trash" />
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
};

const columns = [
  {
    Header: '',
    accessor: 'actions',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: SessionActions,
  },
  {
    Header: 'Session',
    accessor: 'name',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/sessions/${encodeURIComponent(row.original.id)}`}
        className="link"
      >
        {row.values.name}
      </LinkWithQuery>
    ),
  },
  {
    Header: 'Program',
    accessor: 'offeringName',
    Cell: ({ row }) => <span>{row.values.offeringName || '-'}</span>,
  },
  {
    Header: 'Instructors',
    accessor: 'instructors',
    Cell: ({ row }) => {
      const instructorsList = row.values.instructors || [];
      if (instructorsList.length === 0) {
        return <Badge variant="danger" light>Unassigned</Badge>;
      }
      return <span>{instructorsList.join(', ')}</span>;
    },
  },
  {
    Header: 'Classes',
    accessor: 'classesCount',
    Cell: ({ row }) => <span>{row.values.classesCount ?? 0}</span>,
  },
  {
    Header: 'Students Enrolled',
    accessor: 'studentsEnrolled',
    Cell: ({ row }) => <span>{row.values.studentsEnrolled ?? 0}</span>,
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
