import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from '@openedx/paragon';
import { columns } from 'features/Offerings/OfferingsTable/columns';
import Table from 'features/Main/Table';

import { RequestStatus } from 'features/constants';

const OfferingsTable = ({ data, count }) => {
  const offeringsRequest = useSelector((state) => state.offerings.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = offeringsRequest === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3 mx-0">
      <Col xs={12} className="px-4">
        <Table
          isLoading={isLoading}
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
          text="No offerings found."
        />
      </Col>
    </Row>
  );
};

OfferingsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

OfferingsTable.defaultProps = {
  data: [],
  count: 0,
};

export default OfferingsTable;
