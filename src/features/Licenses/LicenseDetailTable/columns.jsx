/* eslint-disable react/prop-types, no-nested-ternary */
import LinkWithQuery from 'features/Main/LinkWithQuery';

const consumedColumn = {
  Header: 'Consumed',
  accessor: 'consumed',
};

const enrolledColumn = {
  Header: 'Enrolled',
  accessor: 'numberOfStudents',
};

const courseNameCell = ({ row }) => (
  <LinkWithQuery to={`/courses/${encodeURIComponent(row.original.masterCourseId)}`} className="link">{row.values.masterCourseName}</LinkWithQuery>
);

const baseColumns = [
  {
    Header: 'Course',
    accessor: 'masterCourseName',
    Cell: courseNameCell,
  },
  enrolledColumn,
];

/**
 * Builds the license detail table columns for the program-type variation.
 *
 * The first column header is the license name together with its total number of
 * courses, linking to the program detail page; sorting is disabled on it since
 * it is a link. It is followed by the `Consumed` and `Enrolled` columns.
 * @param {Object} options - Program variation data.
 * @param {string} options.licenseName - Name of the license pool.
 * @param {number} options.totalCourses - Total courses in the license.
 * @param {string} options.to - Program detail page path.
 * @returns {Array} Column definitions for the program detail table.
 */
const getColumns = ({ licenseName = '', totalCourses = 0, to = '' } = {}) => [
  {
    Header: () => (
      <LinkWithQuery to={to} className="link">{`${licenseName} - ${totalCourses} Courses`}</LinkWithQuery>
    ),
    accessor: 'masterCourseName',
    disableSortBy: true,
    Cell: courseNameCell,
  },
  consumedColumn,
  enrolledColumn,
];

const columns = baseColumns;

export { columns, getColumns };
