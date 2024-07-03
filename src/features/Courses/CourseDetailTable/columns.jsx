/* eslint-disable react/prop-types */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Dropdown, useToggle, IconButton, Icon,
} from '@edx/paragon';
import { Badge } from 'react-paragon-topaz';
import { MoreHoriz } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

import { formatUTCDate, setAssignStaffRole } from 'helpers';

import AddClass from 'features/Courses/AddClass';

import 'assets/global.scss';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => {
      const { courseName } = useParams();
      return (
        <Link
          to={`/courses/${courseName}/${encodeURIComponent(row.values.className)}?classId=${row.original.classId}&previous=courses`}
          className="text-truncate link"
        >
          {row.values.className}
        </Link>
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
              <Link
                to={`/manage-instructors/${encodeURIComponent(masterCourseName)}/${encodeURIComponent(row.values.className)}?classId=${classId}`}
                className="text-truncate text-decoration-none custom-text-black"
              >
                <i className="fa-regular fa-chalkboard-user mr-2 mb-1" />
                Manage Instructors
              </Link>
            </Dropdown.Item>
            <Dropdown.Item onClick={openModal}>
              <i className="fa-solid fa-pencil mr-2 mb-1" />
              Edit Class
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
