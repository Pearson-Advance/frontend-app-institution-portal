import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '@edx/paragon/dist/DataTable';
import { Row, Col } from '@edx/paragon';
import { IntlProvider } from 'react-intl';

const StudentsTable = ({ data, columns, count }) => (
  <IntlProvider locale="en">
    <Row className="justify-content-center my-4 border-gray-300 bg-light-100 my-3">
      <Col xs={11}>
        <DataTable
          isSortable
          itemCount={count}
          data={data}
          columns={columns}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No students found." />
          <DataTable.TableFooter />
        </DataTable>
      </Col>
    </Row>
  </IntlProvider>
);

StudentsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  columns: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

StudentsTable.defaultProps = {
  data: [],
  columns: [],
  count: 0,
};

export { StudentsTable };
