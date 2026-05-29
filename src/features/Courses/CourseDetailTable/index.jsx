import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Table from 'features/Main/Table';

import { columns } from 'features/Courses/CourseDetailTable/columns';
import { RequestStatus } from 'features/constants';

const CourseDetailTable = ({ data, count }) => {
  const classesRequest = useSelector((state) => state.classes.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = classesRequest === RequestStatus.LOADING;

  return (
    <Table
      isLoading={isLoading}
      isSortable
      columns={COLUMNS}
      itemCount={count}
      data={data}
      text="No classes were found."
    />
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
