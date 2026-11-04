import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from 'features/Main/Table';

import { columns } from './columns';

const SessionsTable = ({ data, count, isLoading }) => {
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

SessionsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  count: PropTypes.number,
  isLoading: PropTypes.bool,
};

SessionsTable.defaultProps = {
  data: [],
  count: 0,
  isLoading: false,
};

export default SessionsTable;
