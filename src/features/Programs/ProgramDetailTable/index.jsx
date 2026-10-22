import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from 'features/Main/Table';

import { columns } from 'features/Programs/ProgramDetailTable/columns';

const ProgramDetailTable = ({ data, count, isLoading }) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <Table
      isLoading={isLoading}
      isSortable
      columns={COLUMNS}
      itemCount={count}
      data={data}
      text="No sessions were found."
    />
  );
};

ProgramDetailTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  count: PropTypes.number,
  isLoading: PropTypes.bool,
};

ProgramDetailTable.defaultProps = {
  data: [],
  count: 0,
  isLoading: false,
};

export default ProgramDetailTable;
