/* eslint-disable react/prop-types, no-nested-ternary */
import { Link } from 'react-router-dom';

const columns = [
  {
    Header: 'Course',
    accessor: 'masterCourseName',
    Cell: ({ row }) => (
      <Link to={`/courses/${row.values.masterCourseName}`} className="link">{row.values.masterCourseName}</Link>
    ),
  },
  {
    Header: 'Enrolled',
    accessor: 'numberOfStudents',
  },
];

export { columns };
