import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, DataTable } from '@edx/paragon';
import { columns } from 'features/Classes/ClassesTable/columns';
import { RequestStatus } from 'features/constants';

const ClassesTable = ({ data, count }) => {
  const classesRequest = useSelector((state) => state.classes.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = classesRequest === RequestStatus.LOADING;

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
          <DataTable.EmptyTable content="No classes found." />
          <DataTable.TableFooter />
        </DataTable>
      </Col>
    </Row>
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
