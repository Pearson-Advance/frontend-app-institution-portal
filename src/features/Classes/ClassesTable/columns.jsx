/* eslint-disable react/prop-types, no-nested-ternary */
import React from 'react';
import { format } from 'date-fns';

const columns = [
  {
    Header: 'Course',
    accessor: 'masterCourseName',
  },
  {
    Header: 'Class',
    accessor: 'className',
  },
  {
    Header: 'Start Date',
    accessor: 'startDate',
    Cell: ({ row }) => (row.values.startDate ? format(row.values.startDate, 'MM/dd/yy') : ''),
  },
  {
    Header: 'End Date',
    accessor: 'endDate',
    Cell: ({ row }) => (row.values.endDate ? format(row.values.endDate, 'MM/dd/yy') : ''),
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
    Cell: ({ row }) => (
      <ul className="instructors-list">
        {row.values.instructors && row.values.instructors.map(instructor => <li key={instructor}>{`${instructor}`}</li>)}
      </ul>
    ),
  },
];

export { columns };
