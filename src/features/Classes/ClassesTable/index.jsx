import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';
import { Row, Col } from '@edx/paragon';
import DataTable from '@edx/paragon/dist/DataTable';

import { columns } from 'features/Classes/ClassesTable/columns';

const ClassesTable = ({ data, count }) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <IntlProvider locale="en">
      <Row className="justify-content-center my-4 my-3">
        <Col xs={11} className="p-0">
          <DataTable
            isSortable
            columns={COLUMNS}
            itemCount={count}
            data={data}
          >
            <DataTable.Table />
            <DataTable.EmptyTable content="No classes found." />
            <DataTable.TableFooter />
          </DataTable>
        </Col>
      </Row>
    </IntlProvider>
  );
};

ClassesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

ClassesTable.defaultProps = {
  data: [],
  count: 0,
};

export default ClassesTable;
