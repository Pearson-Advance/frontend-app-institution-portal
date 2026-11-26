/* eslint-disable react/prop-types, no-nested-ternary */
import LinkWithQuery from 'features/Main/LinkWithQuery';

const columns = [
  {
    Header: 'Course',
    accessor: 'masterCourseName',
    Cell: ({ row }) => (
      <LinkWithQuery to={`/courses/${encodeURIComponent(row.original.masterCourseId)}`} className="link">{row.values.masterCourseName}</LinkWithQuery>
    ),
  },
  {
    Header: 'Enrolled',
    accessor: 'numberOfStudents',
  },
];

export { columns };
