import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DataTable from '@edx/paragon/dist/DataTable';
import {
  Row,
  Col,
} from '@edx/paragon';
import { columns } from 'features/Students/StudentsTable/columns';

const StudentsTable = ({
  data,
  count,
}) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <Row className="justify-content-center my-4 my-3">
      <Col xs={11} className="p-0">
        <DataTable
          isSortable
          itemCount={count}
          data={data}
          columns={COLUMNS}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No students found." />
          <DataTable.TableFooter />
        </DataTable>
      </Col>
    </Row>
  );
};

StudentsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

StudentsTable.defaultProps = {
  data: [],
  count: 0,
};

export { StudentsTable };
