/* eslint-disable react/prop-types */
import React from 'react';

const getColumns = () => [
  {
    Header: 'Name',
    accessor: 'learner_name',
  },
  {
    Header: 'Email',
    accessor: 'learner_email',
  },
  {
    Header: 'Course Title',
    accessor: 'ccx_name',
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
