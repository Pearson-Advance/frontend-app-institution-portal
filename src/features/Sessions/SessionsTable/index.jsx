import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from '@openedx/paragon';
import { columns } from 'features/Sessions/SessionsTable/columns';
import Table from 'features/Main/Table';

import { RequestStatus } from 'features/constants';

const SessionsTable = ({ data, count }) => {
  const sessionsRequest = useSelector((state) => state.sessions.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = sessionsRequest === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3 mx-0">
      <Col xs={12} className="px-4">
        <Table
          isLoading={isLoading}
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
          text="No sessions yet. Create a session from a Program to get started."
        />
      </Col>
    </Row>
  );
};

SessionsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

SessionsTable.defaultProps = {
  data: [],
  count: 0,
};

export default SessionsTable;
