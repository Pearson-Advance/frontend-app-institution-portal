/* eslint-disable react/prop-types */
import React from 'react';
import {
  Dropdown,
  IconButton,
  Icon,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

import { Badge } from 'react-paragon-topaz';

import LinkWithQuery from 'features/Main/LinkWithQuery';

import 'assets/global.scss';

const columns = [
  {
    Header: '',
    accessor: 'actions',
    cellClassName: 'dropdownColumn text-center',
    disableSortBy: true,
    Cell: ({ row }) => {
      const courseId = row.original.courseId || row.original.id;
      const learningMfeUrl = getConfig().LEARNING_MICROFRONTEND_URL || '';
      const courseContentUrl = `${learningMfeUrl}/course/${encodeURIComponent(courseId)}/home`;

      return (
        <Dropdown className="dropdowntpz">
          <Dropdown.Toggle
            id={`dropdown-course-${courseId}`}
            as={IconButton}
            src={MoreHoriz}
            iconAs={Icon}
            variant="primary"
            data-testid="dropdown-action"
            alt="menu for actions"
          />
          <Dropdown.Menu popperConfig={{ strategy: 'fixed' }}>
            <Dropdown.Item
              href={courseContentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center"
            >
              <i className="fa-regular fa-arrow-up-right-from-square mr-2" />
              Course content
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  },
  {
    Header: 'Course Name',
    accessor: 'courseName',
    Cell: ({ row }) => {
      const courseId = row.original.courseId || row.original.id;
      const title = row.original.courseName || row.original.courseTitle || '-';

      return (
        <LinkWithQuery
          to={`/courses/${encodeURIComponent(courseId)}`}
          className="link"
        >
          {title}
        </LinkWithQuery>
      );
    },
  },
  {
    Header: 'Sessions',
    accessor: 'numberOfSessions',
    Cell: ({ row }) => (
      <span>{row.original.numberOfSessions ?? 0}</span>
    ),
  },
  {
    Header: 'Instructor',
    accessor: 'instructors',
    Cell: ({ row }) => (
      row.values.missingClassesForInstructor > 0
        ? <Badge variant="danger" light>Missing ({row.values.missingClassesForInstructor})</Badge>
        : <Badge variant="success" light>Ready</Badge>
    ),
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
    Cell: ({ row }) => (
      <span>{row.original.numberOfStudents ?? row.original.enrolledStudents ?? 0}</span>
    ),
  },
];

export { columns };
