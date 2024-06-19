/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

import {
  Dropdown,
  IconButton,
  Icon,
  useToggle,
} from '@edx/paragon';
import { MoreHoriz } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

import AddClass from 'features/Courses/AddClass';

import { formatUTCDate, setAssignStaffRole } from 'helpers';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => (
      <Link
        to={`/courses/${row.original.masterCourseId}/${row.values.className}?classId=${row.original.classId}&previous=classes`}
        className="text-truncate link"
      >
        {row.values.className}
      </Link>
    ),
  },
  {
    Header: 'Course',
    accessor: 'masterCourseName',
  },
  {
    Header: 'Start Date',
    accessor: 'startDate',
    Cell: ({ row }) => (row.values.startDate ? formatUTCDate(row.values.startDate, 'MM/dd/yy') : ''),
  },
  {
    Header: 'End Date',
    accessor: 'endDate',
    Cell: ({ row }) => (row.values.endDate ? formatUTCDate(row.values.endDate, 'MM/dd/yy') : ''),
  },
  {
    Header: 'Min',
    accessor: 'minStudentsAllowed',
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
  },
  {
    Header: 'Instructors',
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
      const [isOpenModal, openModal, closeModal] = useToggle(false);
      return (
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
            <Dropdown.Item onClick={openModal}>
              <i className="fa-regular fa-pen-to-square mr-2 mb-1" />
              Edit Class
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setAssignStaffRole(`${getConfig().LEARNING_MICROFRONTEND_URL}/course/${classId}/home`, classId)}
              className="text-truncate text-decoration-none custom-text-black"
            >
              <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
              View class content
            </Dropdown.Item>
            <Dropdown.Item>
              <Link
                to={`/manage-instructors/${masterCourseName}/${row.values.className}?classId=${classId}&previous=classes`}
                className="text-truncate text-decoration-none custom-text-black"
              >
                <i className="fa-regular fa-chalkboard-user mr-2 mb-1" />
                Manage Instructors
              </Link>
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
              isCoursePage
              isEditing
            />
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  },
];

export { columns };
