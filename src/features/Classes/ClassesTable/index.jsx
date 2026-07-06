import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@openedx/paragon';
import { columns } from 'features/Classes/ClassesTable/columns';
import Table from 'features/Main/Table';

const ClassesTable = ({ data, count, isLoading }) => {
  const COLUMNS = useMemo(() => columns, []);

  return (
    <Row className="justify-content-center my-4 my-3 mx-0">
      <Col xs={12} className="px-4">
        <Table
          isLoading={isLoading}
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
          text="No classes found."
        />
      </Col>
    </Row>
  );
};

ClassesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
  isLoading: PropTypes.bool,
};

ClassesTable.defaultProps = {
  data: [],
  count: 0,
  isLoading: false,
};

export default ClassesTable;
