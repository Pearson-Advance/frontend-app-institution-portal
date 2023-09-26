const columns = [
  {
    Header: 'User Name',
    accessor: 'instructorUsername',
  },
  {
    Header: 'Name',
    accessor: 'instructorName',
  },
  {
    Header: 'Email',
    accessor: 'instructorEmail',
  },
  {
    Header: 'Course key',
    accessor: 'ccxId',
  },
  {
    Header: 'Course name',
    accessor: 'ccxName',
  },
];

const hideColumns = { hiddenColumns: ['ccxId'] };

export { hideColumns, columns };
