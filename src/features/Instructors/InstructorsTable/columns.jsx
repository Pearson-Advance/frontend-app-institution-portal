/* eslint-disable react/prop-types, no-nested-ternary */
import { differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';

const columns = [
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
        <span>{diffHours < 24
          ? 'Today'
          : diffDays < 7
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
