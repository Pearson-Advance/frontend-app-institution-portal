/* eslint-disable react/prop-types */
import LinkWithQuery from 'features/Main/LinkWithQuery';

const licenseNameColumn = {
  Header: 'License Pool',
  accessor: 'licenseName',
  Cell: ({ row }) => (<LinkWithQuery to={`/licenses/${row.original.licenseId}`} className="link">{row.values.licenseName}</LinkWithQuery>),
};

const typeColumn = {
  Header: 'Type',
  accessor: 'licenseType',
  Cell: ({ row }) => (<span className="text-capitalize">{row.values.licenseType}</span>),
};

const baseColumns = [
  licenseNameColumn,
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

/**
 * Builds the license listing columns.
 *
 * When the Offerings feature is enabled the table also exposes the pool `Type`;
 * otherwise it renders exactly as before.
 * @param {boolean} showOfferingsData - Whether Offerings columns are enabled.
 * @returns {Array} Column definitions for the licenses table.
 */
const getColumns = (showOfferingsData = false) => {
  if (!showOfferingsData) {
    return baseColumns;
  }

  const [licensePool, purchased, ...rest] = baseColumns;
  return [licensePool, typeColumn, purchased, ...rest];
};

const columns = baseColumns;

export { columns, getColumns };
