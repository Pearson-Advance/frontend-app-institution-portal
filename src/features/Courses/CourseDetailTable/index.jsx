import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DataTable from '@edx/paragon/dist/DataTable';

import { columns } from 'features/Courses/CourseDetailTable/columns';

const CourseDetailTable = ({ data, count }) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <DataTable
      isSortable
      columns={COLUMNS}
      itemCount={count}
      data={data}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content="No classes were found." />
      <DataTable.TableFooter />
    </DataTable>
  );
};

CourseDetailTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

CourseDetailTable.defaultProps = {
  data: [],
  count: 0,
};

export default CourseDetailTable;
