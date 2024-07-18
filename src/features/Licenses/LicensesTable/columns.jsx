/* eslint-disable react/prop-types */
import LinkWithQuery from 'features/Main/LinkWithQuery';

const columns = [
  {
    Header: 'License Pool',
    accessor: 'licenseName',
    Cell: ({ row }) => (<LinkWithQuery to={`/licenses/${row.original.licenseId}`} className="link">{row.values.licenseName}</LinkWithQuery>),
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
