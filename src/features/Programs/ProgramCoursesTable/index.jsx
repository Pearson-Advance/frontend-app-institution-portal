import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from 'features/Main/Table';

import { columns } from './columns';

const ProgramCoursesTable = ({ data, count, isLoading }) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <Table
      isLoading={isLoading}
      isSortable
      columns={COLUMNS}
      itemCount={count}
      data={data}
      text="No courses were found for this program."
    />
  );
};

ProgramCoursesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  count: PropTypes.number,
  isLoading: PropTypes.bool,
};

ProgramCoursesTable.defaultProps = {
  data: [],
  count: 0,
  isLoading: false,
};

export default ProgramCoursesTable;
