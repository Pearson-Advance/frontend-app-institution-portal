/* eslint-disable react/prop-types, no-nested-ternary */
import { differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';
import { CheckboxControl } from '@edx/paragon';

const handleCheckbox = (setRowsSelected, row) => {
  setRowsSelected(prevState => {
    const rowSelected = row.original.instructorUsername;
    if (prevState.includes(rowSelected)) {
      const filterData = prevState.filter(rowState => rowState !== rowSelected);
      return filterData;
    }
    return [...prevState, rowSelected];
  });
};

const columns = ({ setRowsSelected }) => [
  {
    Header: '',
    id: 'checkbox',
    width: 30,
    Cell: ({ row }) => (
      <div>
        <CheckboxControl
          onChange={() => handleCheckbox(setRowsSelected, row)}
        />
      </div>
    ),
  },
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
    Header: 'Courses Taught',
    accessor: 'classes',
  },
];

export { columns };
