/* eslint-disable react/prop-types, no-nested-ternary */
import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Badge } from 'react-paragon-topaz';

import { ClassStatus, badgeVariants } from 'features/constants';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => (
      <Link
        to={`/courses/${row.values.masterCourseName}/${row.values.className}?classId=${row.original.classId}`}
        className="link"
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
    Header: 'Start - End Date',
    accessor: 'startDate',
    Cell: ({ row }) => {
      const startDate = row.values.startDate ? format(row.values.startDate, 'MM/dd/yy') : '';
      const endDate = row.original.endDate ? format(row.original.endDate, 'MM/dd/yy') : '';
      return <div>{startDate} - {endDate}</div>;
    },
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ row }) => (
      <Badge variant={badgeVariants[row.values.status?.toLowerCase()] || 'success'} light className="text-capitalize">
        {ClassStatus[row.values.status]}
      </Badge>
    ),
  },
];

export { columns };
