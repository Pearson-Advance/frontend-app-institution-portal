/* eslint-disable react/prop-types, no-nested-ternary */
import { differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';

import { daysWeek, hoursDay } from 'features/constants';

const columns = [
  {
    Header: 'Instructor',
    accessor: 'instructorName',
  },
  {
    Header: 'Email',
    accessor: 'instructorEmail',
    Cell: ({ row }) => (
      <a
        href={`mailto:${row.values.instructorEmail}`}
        className="link"
      >
        {row.values.instructorEmail}
      </a>
    ),
  },
  {
    Header: 'Last seen',
    accessor: 'lastAccess',
    Cell: ({ row }) => {
      if (!row.values.lastAccess) {
        return <span>-</span>;
      }

      const currentDate = Date.now();
      const lastDate = new Date(row.values.lastAccess);
      const diffHours = differenceInHours(currentDate, lastDate);
      const diffDays = differenceInDays(currentDate, lastDate);
      const diffWeeks = differenceInWeeks(currentDate, lastDate);
      return (
        <span>
          {diffHours < hoursDay && 'Today'}
          {diffDays < daysWeek && diffDays > 0 && `${diffDays} days ago`}
          {diffDays > daysWeek && `${diffWeeks} wks ago`}
        </span>
      );
    },
  },
  {
    Header: 'Courses Taught',
    accessor: 'classes',
    disableSortBy: true,
  },
];

export { columns };
