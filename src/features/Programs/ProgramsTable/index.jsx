import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from '@openedx/paragon';
import { columns } from 'features/Programs/ProgramsTable/columns';
import Table from 'features/Main/Table';

import { RequestStatus } from 'features/constants';

const ProgramsTable = ({ data, count }) => {
  const programsRequest = useSelector((state) => state.programs.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = programsRequest === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3 mx-0">
      <Col xs={12} className="px-4">
        <Table
          isLoading={isLoading}
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
          text="No programs found."
        />
      </Col>
    </Row>
  );
};

ProgramsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

ProgramsTable.defaultProps = {
  data: [],
  count: 0,
};

export default ProgramsTable;
