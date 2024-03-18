/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import { ProgressBar } from '@edx/paragon';
import { Link } from 'react-router-dom';

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
    Cell: ({ row }) => (
      <Link
        to={`/courses/${row.original.courseName}/${row.values.className}?classId=${row.original.classId}`}
        className="text-truncate link"
      >
        {row.values.className}
      </Link>
    ),
  },
  {
    Header: 'Class Id',
    accessor: 'classId',
  },
  {
    Header: 'Start - End Date',
    accessor: 'startDate',
    Cell: ({ row }) => {
      const startDate = row.values.startDate ? format(row.values.startDate, 'MM/dd/yy') : '';
      const endDate = row.values.endDate ? format(row.values.endDate, 'MM/dd/yy') : '';
      return <div>{startDate} - {endDate}</div>;
    },
  },
  {
    Header: 'Progress',
    accessor: 'completePercentage',
    Cell: ({ row }) => (<ProgressBar now={row.values.completePercentage} variant="primary" />),
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
