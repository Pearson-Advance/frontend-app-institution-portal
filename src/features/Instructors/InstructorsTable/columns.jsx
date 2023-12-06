/* eslint-disable react/prop-types, no-nested-ternary */
import moment from 'moment';

const columns = [
  {
    Header: 'Instructor',
    accessor: 'instructorName',
  },
  {
    Header: 'Last seen',
    accessor: 'lastAccess',
    Cell: ({ row }) => {
      const currentDate = moment(Date.now());
      const lastDate = moment(new Date(row.values.lastAccess));
      const diffHours = currentDate.diff(lastDate, 'hours');
      const diffDays = currentDate.diff(lastDate, 'days');
      const diffWeeks = currentDate.diff(lastDate, 'weeks');
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
