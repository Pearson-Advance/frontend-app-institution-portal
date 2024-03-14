/* eslint-disable react/prop-types, no-nested-ternary */
import { Link } from 'react-router-dom';

const columns = [
  {
    Header: 'License Pool',
    accessor: 'licenseName',
    Cell: ({ row }) => (<Link to={`/licenses/${row.original.licenseId}`} className="link">{row.values.licenseName}</Link>),
  },
  {
    Header: 'Purchased',
    accessor: 'purchasedSeats',
  },
  {
    Header: 'Enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Remaining',
    accessor: 'numberOfPendingStudents',
  },
];

export { columns };
