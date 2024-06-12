import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col, DataTable } from '@edx/paragon';
import { columns } from 'features/Licenses/LicensesTable/columns';

import { RequestStatus } from 'features/constants';

const LicensesTable = ({ data, count }) => {
  const licensesRequest = useSelector((state) => state.licenses.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = licensesRequest === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3 mx-0">
      <Col xs={12} className="px-4">
        <DataTable
          isLoading={isLoading}
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No licenses found." />
        </DataTable>
      </Col>
    </Row>
  );
};

LicensesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

LicensesTable.defaultProps = {
  data: [],
  count: 0,
};

export default LicensesTable;
