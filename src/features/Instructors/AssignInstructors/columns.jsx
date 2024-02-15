/* eslint-disable react/prop-types, no-nested-ternary */
import { differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';

import { daysWeek, hoursDay } from 'features/constants';

const columns = () => [
  {
    Header: 'Instructor',
    accessor: 'instructorName',
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
    Header: 'Courses Taught',
    accessor: 'classes',
    disableSortBy: true,
  },
];

export { columns };
