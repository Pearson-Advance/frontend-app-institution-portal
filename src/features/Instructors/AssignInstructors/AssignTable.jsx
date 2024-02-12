import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IntlProvider } from 'react-intl';
import {
  Row,
  Col,
  DataTable,
} from '@edx/paragon';

import { updateRowsSelected } from 'features/Instructors/data/slice';

import { columns } from 'features/Instructors/AssignInstructors/columns';

const AssignTable = () => {
  const dispatch = useDispatch();
  const stateInstructors = useSelector((state) => state.instructors.table);
  const [rowsSelected, setRowsSelected] = useState([]);
  const COLUMNS = useMemo(() => columns({ setRowsSelected }), []);

  useEffect(() => {
    dispatch(updateRowsSelected(rowsSelected));
  }, [rowsSelected, dispatch]);

  return (
    <IntlProvider locale="en">
      <Row className="justify-content-center my-4 my-3">
        <Col xs={11} className="p-0">
          <DataTable
            isSortable
            columns={COLUMNS}
            itemCount={stateInstructors.count}
            data={stateInstructors.data}
          >
            <DataTable.TableControlBar />
            <DataTable.Table />
            <DataTable.EmptyTable content="No instructors found." />
          </DataTable>
        </Col>
      </Row>
    </IntlProvider>
  );
};

export default AssignTable;
