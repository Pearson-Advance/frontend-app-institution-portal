/* eslint-disable react/prop-types */
import React from 'react';

const getColumns = () => [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Course title',
    accessor: 'courseTitle',
  },
  {
    Header: 'Instructors',
    accessor: 'instructors',
  },
  {
    Header: 'Created',
    accessor: 'created',
  },
];

export { getColumns };
