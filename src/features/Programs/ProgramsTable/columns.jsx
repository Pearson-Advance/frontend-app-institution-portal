/* eslint-disable react/prop-types */
import React from 'react';

import {
  Dropdown,
  IconButton,
  Icon,
  useToggle,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';

import AddSessionModal from 'features/Sessions/AddSessionModal';
import LinkWithQuery from 'features/Main/LinkWithQuery';

const ProgramActions = ({ row }) => {
  const { id, name } = row.original;
  const [isCreateSessionOpen, openCreateSession, closeCreateSession] = useToggle(false);

  return (
    <>
      <Dropdown className="dropdowntpz">
        <Dropdown.Toggle
          id="program-actions-toggle"
          as={IconButton}
          src={MoreHoriz}
          iconAs={Icon}
          variant="primary"
          data-testid="program-action"
          alt="menu for program actions"
        />
        <Dropdown.Menu popperConfig={{ strategy: 'fixed' }}>
          <Dropdown.Item onClick={openCreateSession} data-testid="create-session-action">
            <i className="fa-regular fa-calendar-plus mr-2 mb-1" />
            Create a session
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <AddSessionModal
        isOpen={isCreateSessionOpen}
        onClose={closeCreateSession}
        programInfo={{ programId: String(id), programTitle: name }}
      />
    </>
  );
};

const columns = [
  {
    Header: '',
    id: 'actions',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ProgramActions,
  },
  {
    Header: 'Programs',
    accessor: 'name',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/programs/${encodeURIComponent(row.original.id)}`}
        className="link"
      >
        {row.original.name}
      </LinkWithQuery>
    ),
  },
  {
    Header: 'Courses',
    accessor: 'numberOfCourses',
  },
  {
    Header: 'Sessions',
    accessor: 'numberOfRuns',
  },
  {
    Header: 'Students enrolled',
    accessor: 'studentsEnrolled',
  },
];

export { columns };
