import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@edx/paragon';
import DataTable from '@edx/paragon/dist/DataTable';

import { columns } from 'features/Instructors/InstructorsTable/columns';
import { RequestStatus } from 'features/constants';

const InstructorsTable = ({
  data,
  count,
}) => {
  const instructorsRequest = useSelector((state) => state.instructors.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = instructorsRequest === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3">
      <Col xs={11} className="p-0">
        <DataTable
          isLoading={isLoading}
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No instructors found." />
          <DataTable.TableFooter />
        </DataTable>
      </Col>
    </Row>
  );
};

InstructorsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

InstructorsTable.defaultProps = {
  data: [],
  count: 0,
};

export default InstructorsTable;
