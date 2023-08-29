import React from 'react';
import DataTable from '@edx/paragon/dist/DataTable';
import PropTypes from 'prop-types';
import { Row, Col } from '@edx/paragon';

const StudentsTable = ({ data, columns, count, hideColumns }) => {
    return(
        <Row className="justify-content-center my-4 border-gray-300 bg-light-100 my-3">
            <Col xs={11}>
            <DataTable
                isSortable
                itemCount={count}
                data={data}
                columns={columns}
                initialState={hideColumns}
            >
                <DataTable.Table />
                <DataTable.EmptyTable content="No enrollments found." />
                <DataTable.TableFooter />
            </DataTable>
            </Col>
        </Row>
    );
};

StudentsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
  columns: PropTypes.arrayOf(PropTypes.shape([])),
  hideColumns: PropTypes.oneOfType({}),
};

StudentsTable.defaultProps = {
  data: [],
  count: 0,
  columns: [],
  hideColumns: {},
};

export { StudentsTable };
