/* eslint-disable react/prop-types */
import React from 'react';
import { ProgressBar } from '@edx/paragon';
import { Badge } from 'react-paragon-topaz';
import { Link } from 'react-router-dom';

import { useInstitutionIdQueryParam } from 'hooks';

const badgeVariants = {
  active: 'success',
  inactive: 'secondary',
  expired: 'danger',
  pending: 'warning',
};

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
      <Badge variant={badgeVariants[row.values.status?.toLowerCase()] || 'success'} light className="text-capitalize">
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
    Header: 'Exam ready',
    accessor: 'examReady',
    Cell: ({ row }) => <span>{row.values.examReady ? 'Yes' : 'No'}</span>,
  },
];

export { columns };
