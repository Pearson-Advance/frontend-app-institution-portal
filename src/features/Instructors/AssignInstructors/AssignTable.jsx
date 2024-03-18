import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  Row,
  Col,
  DataTable,
} from '@edx/paragon';
import ControlledSelect from 'features/Instructors/AssignInstructors/ControlledSelect';

import { columns } from 'features/Instructors/AssignInstructors/columns';

const AssignTable = () => {
  const stateInstructors = useSelector((state) => state.instructors.table);
  const COLUMNS = useMemo(() => columns(), []);

  const selectColumn = {
    id: 'selection',
    Header: <></>, // eslint-disable-line react/jsx-no-useless-fragment
    Cell: ControlledSelect,
    disableSortBy: true,
  };

  return (
    <Row className="justify-content-center my-4 my-3">
      <Col xs={11} className="p-0">
        <DataTable
          isSortable
          isSelectable
          columns={COLUMNS}
          itemCount={stateInstructors.count}
          data={stateInstructors.data}
          manualSelectColumn={selectColumn}
          initialTableOptions={{
            autoResetSelectedRows: false,
            getRowId: (row) => row.instructorUsername,
          }}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No instructors found." />
        </DataTable>
      </Col>
    </Row>
  );
};

export default AssignTable;
