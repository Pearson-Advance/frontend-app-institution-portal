import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from '@openedx/paragon';
import { columns } from 'features/OfferingRuns/OfferingRunsTable/columns';
import Table from 'features/Main/Table';

import { RequestStatus } from 'features/constants';

const OfferingRunsTable = ({ data, count }) => {
  const offeringRunsRequest = useSelector((state) => state.offeringRuns.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = offeringRunsRequest === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3 mx-0">
      <Col xs={12} className="px-4">
        <Table
          isLoading={isLoading}
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
          text="No offering runs yet. Create a run from an Offering to get started."
        />
      </Col>
    </Row>
  );
};

OfferingRunsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

OfferingRunsTable.defaultProps = {
  data: [],
  count: 0,
};

export default OfferingRunsTable;
