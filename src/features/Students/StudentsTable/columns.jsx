/* eslint-disable react/prop-types */
import {
  ProgressBar,
  Dropdown,
  IconButton,
  Icon,
} from '@edx/paragon';
import { Link } from 'react-router-dom';
import { MoreHoriz } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { Badge, STUDENT_STATUS_VARIANTS } from 'react-paragon-topaz';

import LinkWithQuery from 'features/Main/LinkWithQuery';
import DeleteEnrollment from 'features/Main/DeleteEnrollment';

import { formatUTCDate } from 'helpers';
import { useInstitutionIdQueryParam } from 'hooks';

const columns = [
  {
    Header: 'Student',
    accessor: 'learnerName',
    Cell: ({ row }) => {
      const addQueryParam = useInstitutionIdQueryParam();
      const url = addQueryParam(`/students/${encodeURIComponent(row.original.learnerEmail)}`);

      return (
        <Link
          to={url}
          className="text-truncate link"
        >
          {row.values.learnerName}
        </Link>
      );
    },
  },
  {
    Header: 'Email',
    accessor: 'learnerEmail',
    Cell: ({ row }) => (
      <a
        href={`mailto:${row.values.learnerEmail}`}
        className="link"
      >
        {row.values.learnerEmail}
      </a>
    ),
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ row }) => (
      <Badge variant={STUDENT_STATUS_VARIANTS[row.values.status?.toLowerCase()] || 'success'} light className="text-capitalize">
        {row.values.status}
      </Badge>
    ),
  },
  {
    Header: 'Class Name',
    accessor: 'className',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/courses/${encodeURIComponent(row.original.courseId)}/${encodeURIComponent(row.original.classId)}`}
        className="text-truncate link"
      >
        {row.values.className}
      </LinkWithQuery>
    ),
  },
  {
    Header: 'Start - End Date',
    accessor: 'startDate',
    Cell: ({ row }) => {
      const startDate = row.original.startDate ? formatUTCDate(row.original.startDate, 'MM/dd/yy') : '';
      const endDate = row.original.endDate ? formatUTCDate(row.original.endDate, 'MM/dd/yy') : '';
      return <div>{startDate} - {endDate}</div>;
    },
  },
  {
    Header: 'Progress',
    accessor: 'completePercentage',
    Cell: ({ row }) => (<ProgressBar now={row.values.completePercentage} variant="primary" />),
  },
  {
    Header: 'Exam Ready',
    accessor: 'examReady',
    Cell: ({ row }) => (row.values.examReady ? 'yes' : 'no'),
  },
  {
    Header: '',
    accessor: 'classId',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const {
        classId,
        userId,
        learnerEmail,
      } = row.original;

      const progressPageLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${classId}/progress/${userId}`;

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
              href={progressPageLink}
              className="text-truncate text-decoration-none custom-text-black"
            >
              <i className="fa-regular fa-bars-progress mr-2" />
              View progress
            </Dropdown.Item>
            {
              row.values.status?.toLowerCase() !== 'expired' && (
                <DeleteEnrollment studentEmail={learnerEmail} classId={classId} />
              )
            }
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  },
];

export { columns };
