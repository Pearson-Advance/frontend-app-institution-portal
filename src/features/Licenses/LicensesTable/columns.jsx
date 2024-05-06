/* eslint-disable react/prop-types */
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
    Header: 'Pending',
    accessor: 'numberOfPendingStudents',
  },
  {
    Header: 'Remaining',
    accessor: 'remaining',
    Cell: ({ row: { original: { purchasedSeats = 0, numberOfStudents = 0, numberOfPendingStudents = 0 } } }) => (
      <span>{purchasedSeats - numberOfStudents - numberOfPendingStudents}</span>
    ),
  },
];

export { columns };
