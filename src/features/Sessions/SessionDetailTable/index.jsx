import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from 'features/Main/Table';

import { getColumns } from './columns';

const SessionDetailTable = ({
  data, count, isLoading, sessionId,
}) => {
  const COLUMNS = useMemo(() => getColumns({ sessionId }), [sessionId]);

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
  sessionId: PropTypes.string,
};

SessionDetailTable.defaultProps = {
  data: [],
  count: 0,
  isLoading: false,
  sessionId: '',
};

export default SessionDetailTable;
