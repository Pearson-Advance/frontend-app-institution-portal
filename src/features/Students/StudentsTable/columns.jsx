/* eslint-disable react/prop-types */
import React from 'react';
import { Badge } from 'react-paragon-topaz';

const getColumns = () => [
  {
    Header: 'Student',
    accessor: 'learnerName',
  },
  {
    Header: 'Course',
    accessor: 'courseName',
  },
  {
    Header: 'Course Id',
    accessor: 'courseId',
  },
  {
    Header: 'Class Name',
    accessor: 'className',
  },
  {
    Header: 'Class Id',
    accessor: 'classId',
  },
  {
    Header: 'Instructor',
    accessor: 'instructors',
    Cell: ({ row }) => (
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {row.values.instructors.map(instructor => <li key={instructor}>{instructor}</li>)}
      </ul>
    ),
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ row }) => {
      switch (row.values.status) {
        case 'Active':
          return <Badge variant="success" light>Active</Badge>;
        case 'Inactive':
          return <Badge variant="secondary" light>Inactive</Badge>;
        case 'Expired':
          return <Badge variant="danger" light>Expired</Badge>;
        case 'Pending':
          return <Badge variant="warning" light>Pending</Badge>;
        default:
          return null;
      }
    },
  },
  {
    Header: 'Exam Ready',
    accessor: 'examReady',
    Cell: ({ row }) => (row.values.examReady ? 'yes' : 'no'),
  },
];

// We don't need to show ccxId column but we need it to use handleStudentsActions.
const hideColumns = { hiddenColumns: ['classId', 'courseId'] };

export { hideColumns, getColumns };
