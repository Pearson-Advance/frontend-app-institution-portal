/* eslint-disable react/prop-types, no-nested-ternary */
import { differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';
import { Link } from 'react-router-dom';

import { daysWeek, hoursDay } from 'features/constants';

const columns = [
  {
    Header: 'Instructor',
    accessor: 'instructorName',
    Cell: ({ row }) => (
      <Link
        to={`/instructors/${row.original.instructorUsername}`}
        className="link"
      >
        {row.values.instructorName}
      </Link>
    ),
  },
  {
    Header: 'Last seen',
    accessor: 'lastAccess',
    Cell: ({ row }) => {
      const currentDate = Date.now();
      const lastDate = new Date(row.values.lastAccess);
      const diffHours = differenceInHours(currentDate, lastDate);
      const diffDays = differenceInDays(currentDate, lastDate);
      const diffWeeks = differenceInWeeks(currentDate, lastDate);
      return (
        <span>{diffHours < hoursDay
          ? 'Today'
          : diffDays < daysWeek
            ? `${diffDays} days ago`
            : `${diffWeeks} wks ago`}
        </span>
      );
    },
  },
  {
    Header: 'Email',
    accessor: 'instructorEmail',
  },
  {
    Header: 'Courses Taught',
    accessor: 'classes',
  },
];

export { columns };
