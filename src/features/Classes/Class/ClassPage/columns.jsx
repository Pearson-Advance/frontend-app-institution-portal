/* eslint-disable react/prop-types */
import React from 'react';
import {
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
import VoucherOptions from 'features/Main/VoucherOptions';

const getColumns = (displayVoucherOptions) => ([
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
    Header: 'Current Grade',
    accessor: 'completePercentage',
    Cell: ({ row }) => {
      const raw = row?.values?.completePercentage;

      const safeNumber = Number(raw);

      const value = Number.isFinite(safeNumber)
        ? Math.min(100, Math.max(0, Math.floor(safeNumber)))
        : 0;

      return (
        <span className="course-progress">
          {value}%
        </span>
      );
    },
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

          <Overlay target={() => target.current} show={show} placement="left">
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
        isVoucherAvailable,
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
            {displayVoucherOptions && (
            <VoucherOptions
              courseId={courseId}
              learnerEmail={learnerEmail}
              isVoucherAvailable={isVoucherAvailable}
            />
            )}
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
]);

export { getColumns };
