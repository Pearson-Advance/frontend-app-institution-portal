/* eslint-disable react/prop-types */

const getColumns = () => [
  {
    Header: 'Student',
    accessor: 'learnerName',
  },
  {
    Header: 'Email',
    accessor: 'learnerEmail',
  },
  {
    Header: 'Class Name',
    accessor: 'className',
  },
  {
    Header: 'Class Id',
    accessor: 'classId',
  },
  {
    Header: 'Exam Ready',
    accessor: 'examReady',
    Cell: ({ row }) => (row.values.examReady ? 'yes' : 'no'),
  },
];

// We don't need to show ccxId column but we need it to use handleStudentsActions.
const hideColumns = { hiddenColumns: ['classId'] };

export { hideColumns, getColumns };
