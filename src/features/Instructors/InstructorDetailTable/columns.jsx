/* eslint-disable react/prop-types, no-nested-ternary */
import React from 'react';
import { Badge } from 'react-paragon-topaz';

import { ClassStatus, badgeVariants } from 'features/constants';
import { formatUTCDate } from 'helpers';

import LinkWithQuery from 'features/Main/LinkWithQuery';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => (
      <LinkWithQuery
        to={`/courses/${encodeURIComponent(row.original.masterCourseId)}/${encodeURIComponent(row.original.classId)}?previous=instructors`}
        className="link"
      >
        {row.values.className}
      </LinkWithQuery>
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
      const startDate = row.values.startDate ? formatUTCDate(row.values.startDate, 'MM/dd/yy') : '';
      const endDate = row.original.endDate ? formatUTCDate(row.original.endDate, 'MM/dd/yy') : '';
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
