import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataTable from '@edx/paragon/dist/DataTable';

import { columns } from 'features/Courses/CourseDetailTable/columns';
import { RequestStatus } from 'features/constants';

const CourseDetailTable = ({ data, count }) => {
  const classesRequest = useSelector((state) => state.classes.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = classesRequest === RequestStatus.LOADING;

  return (
    <DataTable
      isLoading={isLoading}
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
