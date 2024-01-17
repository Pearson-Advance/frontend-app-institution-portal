import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';
import { Row, Col, DataTable } from '@edx/paragon';
import { columns } from 'features/Licenses/LicensesTable/columns';

const LicensesTable = ({ data, count }) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <IntlProvider locale="en">
      <Row className="justify-content-center my-4 my-3 mx-0">
        <Col xs={12} className="px-4">
          <DataTable
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
    </IntlProvider>
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
