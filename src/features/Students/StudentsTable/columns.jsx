/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '@edx/paragon';

const getColumns = props => [
  {
    Header: 'Name',
    accessor: 'learner_name',
  },
  {
    Header: 'Email',
    accessor: 'learner_email',
  },
  {
    Header: 'Class Name',
    accessor: 'ccx_name',
  },
  {
    Header: 'Class Id',
    accessor: 'ccx_id',
    disableSortBy: true,
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
  {
    Header: 'Action',
    accessor: 'status',
    disableSortBy: true,
    Cell: ({ row }) => {
      const value = row.values;

      if (value.status !== 'Pending') {
        return null;
      }

      return <Button variant="outline-danger" onClick={() => { props.openAlertModal(); props.setRow(value); }}>Revoke</Button>;
    },
  },
];

// We don't need to show ccx_id column but we need it to use handleStudentsActions.
const hideColumns = { hiddenColumns: ['ccx_id'] };

export { hideColumns, getColumns };
