/* eslint-disable react/prop-types, no-nested-ternary */
import React from 'react';
import { getConfig } from '@edx/frontend-platform';

import { Link } from 'react-router-dom';
import { Badge } from 'react-paragon-topaz';
import {
  Dropdown, IconButton, Icon, useToggle,
} from '@edx/paragon';
import { MoreHoriz } from '@edx/paragon/icons';
import AddClass from 'features/Courses/AddClass';

const columns = [
  {
    Header: 'Courses',
    accessor: 'masterCourseName',
    Cell: ({ row }) => (<Link to={`/courses/${row.values.masterCourseName}`} className="link">{row.values.masterCourseName}</Link>),
  },
  {
    Header: 'Classes',
    accessor: 'numberOfClasses',
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
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Students invited',
    accessor: 'numberOfPendingStudents',
  },
  {
    Header: '',
    accessor: 'className',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const [isOpenModal, openModal, closeModal] = useToggle(false);
      const courseDetailsLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${row.original.masterCourseId}/home`;
      return (
        <Dropdown className="dropdowntpz">
          <Dropdown.Toggle
            id="dropdown-toggle-with-iconbutton"
            as={IconButton}
            src={MoreHoriz}
            iconAs={Icon}
            variant="primary"
            data-testid="droprown-action"
            alt="menu for action"
          />
          <Dropdown.Menu>
            <Dropdown.Item href={courseDetailsLink} target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
              Course Details
            </Dropdown.Item>
            <Dropdown.Item onClick={openModal}>
              <i className="fa-solid fa-plus mr-2 mb-1" />
              Add Class
            </Dropdown.Item>
            <AddClass
              isOpen={isOpenModal}
              onClose={closeModal}
              courseInfo={{
                masterCourseName: row.original.masterCourseName,
                masterCourseId: row.original.masterCourseId,
              }}
              isCoursePage
            />
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  },
];

export { columns };
