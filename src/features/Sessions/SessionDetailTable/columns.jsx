/* eslint-disable react/prop-types */
import React from 'react';
import {
  Dropdown,
  useToggle,
  IconButton,
  Icon,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';

import { formatUTCDate, formatInstructorsWithStatus } from 'helpers';

import AddClass from 'features/Courses/AddClass';
import LinkWithQuery from 'features/Main/LinkWithQuery';

import 'assets/global.scss';

const columns = [
  {
    Header: '',
    accessor: 'actions',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const {
        classId,
        className,
        masterCourseId,
        masterCourseName,
        minStudents,
        maxStudents,
        startDate,
        endDate,
      } = row.original;

      const [isOpenEditClassModal, openEditClassModal, closeEditClassModal] = useToggle(false);

      return (
        <>
          <Dropdown className="dropdowntpz">
            <Dropdown.Toggle
              id={`dropdown-${classId}`}
              as={IconButton}
              src={MoreHoriz}
              iconAs={Icon}
              variant="primary"
              data-testid="dropdown-action"
              alt="menu for actions"
            />
            <Dropdown.Menu popperConfig={{ strategy: 'fixed' }}>
              <Dropdown.Item onClick={openEditClassModal}>
                <i className="fa-solid fa-pencil mr-2 mb-1" />
                Edit class
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

            </Dropdown.Menu>
          </Dropdown>
          <AddClass
            isOpen={isOpenEditClassModal}
            onClose={closeEditClassModal}
            courseInfo={{
              masterCourseName,
              masterCourseId,
              classId,
              className,
              startDate,
              endDate,
              minStudents,
              maxStudents,
            }}
            isEditing
          />
        </>
      );
    },
  },
  {
    Header: 'Class Name',
    accessor: 'className',
    Cell: ({ row }) => <span>{row.values.className}</span>,
  },
  {
    Header: 'Course Name',
    accessor: 'courseName',
    Cell: ({ row }) => <span>{row.values.courseName}</span>,
  },
  {
    Header: 'Instructors',
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
    Header: 'Min',
    accessor: 'minStudents',
    Cell: ({ row }) => <span>{row.values.minStudents ?? '-'}</span>,
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
    Cell: ({ row }) => <span>{row.values.maxStudents ?? '-'}</span>,
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
    Cell: ({ row }) => <span>{row.values.numberOfStudents}</span>,
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
