import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col, DataTable } from '@openedx/paragon';

import { columns } from 'features/Courses/CoursesTable/columns';
import { RequestStatus } from 'features/constants';
import 'features/Courses/CoursesTable/index.scss';

const CoursesTable = ({ data, count }) => {
  const coursesRequest = useSelector((state) => state.courses.table.status);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = coursesRequest === RequestStatus.LOADING;

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
          <DataTable.EmptyTable content="No courses found." />
          <DataTable.TableFooter />
        </DataTable>
      </Col>
    </Row>
  );
};

CoursesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
};

CoursesTable.defaultProps = {
  data: [],
  count: 0,
};

export default CoursesTable;
