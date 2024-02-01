/* eslint-disable react/prop-types, no-nested-ternary */
import React from 'react';
import { Badge } from 'react-paragon-topaz';

const columns = [
  {
    Header: 'Courses',
    accessor: 'masterCourseName',
  },
  {
    Header: 'Classes',
    accessor: 'numberOfClasses',
  },
  {
    Header: 'Instructor',
    accessor: 'missingClassesForInstructor',
    Cell: ({ row }) => (
      row.values.missingClassesForInstructor > 0
        ? <Badge variant="danger" light>Missing ({row.values.missingClassesForInstructor})</Badge>
        : <Badge variant="success" light>Ready</Badge>
    ),
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Students invited',
    accessor: 'numberOfPendingStudents',
  },
];

export { columns };
