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
    Header: 'Enrollment Status',
    accessor: 'numberOfStudents',
    Cell: ({ row }) => (
      row.values.numberOfPendingStudents > 0
        ? <Badge variant="warning" light>Pending ({row.values.numberOfPendingStudents})</Badge>
        : <Badge variant="success" light>Complete</Badge>
    ),
  },
  {
    Header: 'Students Enrolled',
    accessor: 'numberOfPendingStudents',
    Cell: ({ row }) => {
      const pendingStudents = row.values.numberOfPendingStudents || 0;
      const students = row.values.numberOfStudents || 0;
      return (
        `${(students + pendingStudents) - pendingStudents}/${
          students + pendingStudents}`
      );
    },
  },
];

export { columns };
