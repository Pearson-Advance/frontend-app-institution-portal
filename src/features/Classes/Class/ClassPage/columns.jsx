/* eslint-disable react/prop-types */
import React from 'react';
import {
  ProgressBar,
  Dropdown,
  IconButton,
  Icon,
  Overlay,
} from '@edx/paragon';
import { Badge, STUDENT_STATUS_VARIANTS, ProgressSteps } from 'react-paragon-topaz';
import { Link } from 'react-router-dom';
import { MoreHoriz } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

import { formatUTCDate } from 'helpers';
import { useInstitutionIdQueryParam } from 'hooks';
import DeleteEnrollment from 'features/Main/DeleteEnrollment';
import AssignVoucher from 'features/Main/AssignVoucher';

const columns = [
  {
    Header: 'No',
    accessor: 'index',
    Cell: ({ row }) => (<span>{row.index + 1}</span>),
  },
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
    Header: 'Courseware Progress',
    accessor: 'completePercentage',
    Cell: ({ row }) => (
      <ProgressBar now={row.values.completePercentage} variant="primary" className="custom-progress" />
    ),
  },
  {
    Header: 'Exam Ready',
    accessor: 'examReady',
    Cell: ({ row }) => (<ProgressSteps status={row.values.examReady.status.toLowerCase()} />),
  },
  {
    Header: 'Last exam date',
    accessor: 'examReady.lastExamDate',
    Cell: ({ row }) => {
      const lastExamDate = row.values.examReady.lastExamDate
        ? formatUTCDate(row.values.examReady.lastExamDate, 'MM/dd/yy')
        : '--';
      return <span>{lastExamDate}</span>;
    },
  },
  {
    Header: () => {
      const [show, setShow] = React.useState(false);
      const target = React.useRef(null);

      return (
        <>
          <span
            ref={target}
            className="epp-header"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            Epp days left
            <i className="fa-regular fa-circle-info ml-1" />
          </span>

          <Overlay target={() => target.current} show={show} placement="right">
            {({
              placement, arrowProps, show: _show, popper, ...props
            }) => (
              <div
                {...props}
                className="epp-overlay"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
              >
                Number of days left to achieve the next stage of Exam Pass Qualification.{' '}
                <a
                  href="https://www.mindhubpro.com/exam-pass-pledge#:~:text=To%20make%20an%20Exam%20Pass,where%20the%20exam%20was%20taken."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="epp-link"
                >
                  More info
                </a>
              </div>
            )}
          </Overlay>
        </>
      );
    },
    accessor: 'examReady.eppDaysLeft',
    Cell: ({ row }) => {
      const { eppDaysLeft = null } = row.values.examReady;
      return <span>{eppDaysLeft !== null ? eppDaysLeft : '--'}</span>;
    },
  },
  {
    Header: '',
    accessor: 'classId',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const {
        status,
        classId,
        courseId,
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
            <AssignVoucher courseId={courseId} learnerEmail={learnerEmail} />
            {
              status?.toLowerCase() !== 'expired' && (
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
