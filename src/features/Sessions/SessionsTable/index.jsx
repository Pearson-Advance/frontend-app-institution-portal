import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from 'features/Main/Table';

import { getColumns } from './columns';

const SessionsTable = ({
  data, count, isLoading, onShowToast,
}) => {
  const COLUMNS = useMemo(() => getColumns(onShowToast), [onShowToast]);

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
  onShowToast: PropTypes.func,
};

SessionsTable.defaultProps = {
  data: [],
  count: 0,
  isLoading: false,
  onShowToast: () => {},
};

export default SessionsTable;
