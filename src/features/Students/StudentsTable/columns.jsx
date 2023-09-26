/* eslint-disable react/prop-types */
import React from 'react';
import { Badge, Button } from '@edx/paragon';

const getColumns = props => [
  {
    Header: 'Name',
    accessor: 'learnerName',
  },
  {
    Header: 'Email',
    accessor: 'learnerEmail',
  },
  {
    Header: 'Class Name',
    accessor: 'ccxName',
  },
  {
    Header: 'Class Id',
    accessor: 'ccxId',
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
    Cell: ({ row }) => (
      row.values.created
        ? new Date(row.values.created).toUTCString()
        : ''
    ),
  },
  {
    Header: 'First Access',
    accessor: 'firstAccess',
    Cell: ({ row }) => (
      row.values.firstAccess
        ? new Date(row.values.firstAccess).toUTCString()
        : ''
    ),
  },
  {
    Header: 'Last Access',
    accessor: 'lastAccess',
    Cell: ({ row }) => (
      row.values.lastAccess
        ? new Date(row.values.lastAccess).toUTCString()
        : ''
    ),
  },
  {
    Header: 'Grade',
    accessor: 'grade',
    Cell: ({ row }) => <Badge variant={row.values.grade ? 'success' : 'danger'}>{row.values.grade ? 'pass' : 'fail'}</Badge>,
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

// We don't need to show ccxId column but we need it to use handleStudentsActions.
const hideColumns = { hiddenColumns: ['ccxId'] };

export { hideColumns, getColumns };
