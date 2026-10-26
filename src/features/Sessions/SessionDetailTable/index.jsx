import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from 'features/Main/Table';

import { columns } from './columns';

const SessionDetailTable = ({ data, count, isLoading }) => {
  const COLUMNS = useMemo(() => columns, []);

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

SessionDetailTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  count: PropTypes.number,
  isLoading: PropTypes.bool,
};

SessionDetailTable.defaultProps = {
  data: [],
  count: 0,
  isLoading: false,
};

export default SessionDetailTable;
