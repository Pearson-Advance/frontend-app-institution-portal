import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataTable from '@edx/paragon/dist/DataTable';
import {
  Row,
  Col,
} from '@edx/paragon';

import { columns } from 'features/Students/StudentsTable/columns';
import { RequestStatus } from 'features/constants';

const StudentsTable = ({
  data,
  count,
}) => {
  const studentsRequest = useSelector((state) => state.students.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = studentsRequest === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3">
      <Col xs={11} className="p-0">
        <DataTable
          isLoading={isLoading}
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
