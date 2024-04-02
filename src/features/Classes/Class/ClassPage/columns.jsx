/* eslint-disable react/prop-types */
import React from 'react';
import { ProgressBar } from '@edx/paragon';
import { Badge } from 'react-paragon-topaz';

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
    Cell: ({ row }) => (<span className="text-capitalize">{row.values.learnerName}</span>),
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
