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
    Header: 'Course title',
    accessor: 'ccx_name',
  },
  {
    Header: 'Instructors',
    accessor: 'instructors',
    Cell: ({ row }) => (
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {row.values.instructors.map(instructor => <li key={instructor}>{instructor}</li>)}
      </ul>
    ),
  },
  {
    Header: 'Created',
    accessor: 'created',
    Cell: ({ row }) => new Date(row.values.created).toUTCString(),
  },
];

export { getColumns };
