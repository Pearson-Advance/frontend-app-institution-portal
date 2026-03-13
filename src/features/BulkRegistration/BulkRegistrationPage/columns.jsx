import StatusBadge from 'features/BulkRegistration/BulkRegistrationPage/components/StatusBadge';

export const ERROR_COLUMNS = [
  { Header: 'ROW', accessor: 'row' },
  { Header: 'FIRST NAME', accessor: 'firstName' },
  { Header: 'LAST NAME', accessor: 'lastName' },
  { Header: 'EMAIL', accessor: 'email' },
  {
    Header: 'STATUS',
    accessor: 'status',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => <StatusBadge status={value} />,
  },
  { Header: 'MESSAGE', accessor: 'message' },
];
