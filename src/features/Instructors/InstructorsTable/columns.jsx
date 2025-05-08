/* eslint-disable react/prop-types, no-nested-ternary */
import { differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';
import {
  Dropdown,
  IconButton,
  Icon,
  useToggle,
} from '@edx/paragon';
import { MoreHoriz } from '@edx/paragon/icons';

import InstructorForm from 'features/Instructors/InstructorForm';
import { daysWeek, hoursDay } from 'features/constants';

import LinkWithQuery from 'features/Main/LinkWithQuery';

const getColumns = (showInstructorFeature) => [
  {
    Header: 'Instructor',
    accessor: 'instructorName',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/instructors/${row.original.instructorUsername}`}
        className="link"
      >
        {row.values.instructorName}
      </LinkWithQuery>
    ),
  },
  {
    Header: 'Last seen',
    accessor: 'lastAccess',
    Cell: ({ row }) => {
      if (!row.values.lastAccess) {
        return <span>-</span>;
      }

      const currentDate = Date.now();
      const lastDate = new Date(row.values.lastAccess);
      const diffHours = differenceInHours(currentDate, lastDate);
      const diffDays = differenceInDays(currentDate, lastDate);
      const diffWeeks = differenceInWeeks(currentDate, lastDate);
      return (
        <span>{diffHours < hoursDay
          ? 'Today'
          : diffDays < daysWeek
            ? `${diffDays} days ago`
            : `${diffWeeks} wks ago`}
        </span>
      );
    },
  },
  {
    Header: 'Email',
    accessor: 'instructorEmail',
    Cell: ({ row }) => (
      <a
        href={`mailto:${row.values.instructorEmail}`}
        className="link"
      >
        {row.values.instructorEmail}
      </a>
    ),
  },
  {
    Header: 'Courses Taught',
    accessor: 'classes',
  },
  showInstructorFeature && {
    Header: 'Status',
    accessor: 'active',
    Cell: ({ row }) => (
      <span>{row.original.active ? 'Active' : 'Inactive'}</span>
    ),
  },
  showInstructorFeature && {
    Header: '',
    accessor: 'instructorId',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const {
        instructorName,
        instructorEmail,
        hasEnrollmentPrivilege,
        instructorId,
      } = row.original;

      const [isOpenModal, openModal, closeModal] = useToggle(false);

      return (
        <>
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
                className="text-truncate text-decoration-none custom-text-black"
                onClick={openModal}
              >
                <i className="fa-regular fa-user-pen mr-2" />
                Edit Instructor
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <InstructorForm
            isOpen={isOpenModal}
            onClose={closeModal}
            isEditing
            instructorInfo={{
              instructorName,
              instructorId,
              instructorEmail,
              hasEnrollmentPrivilege,
            }}
          />
        </>
      );
    },
  },
].filter(Boolean);

export { getColumns };
