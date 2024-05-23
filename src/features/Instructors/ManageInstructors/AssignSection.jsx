/* eslint-disable react/prop-types */
import React, {
  useMemo, useState, useEffect, forwardRef, useRef, useImperativeHandle,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Container, Row, Col, DataTable, Pagination, Button,
} from '@edx/paragon';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import ControlledSelect from 'features/Instructors/ManageInstructors/ControlledSelect';

import { fetchInstructorsData } from 'features/Instructors/data';
import {
  updateCurrentPage,
} from 'features/Instructors/data/slice';

import { columns } from 'features/Instructors/ManageInstructors/columns';
import { initialPage, RequestStatus } from 'features/constants';

// Component to get access the clearSelection function
const ClearAction = ({ tableInstance, clearSelectionRef }) => (
  <Button
    style={{ display: 'none' }}
    onClick={() => {
      tableInstance.clearSelection();
    }}
    ref={clearSelectionRef}
  >
    Clear Selection
  </Button>
);

const AssignSection = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const clearSelectionRef = useRef(null);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateInstructors = useSelector((state) => state.instructors.table);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = stateInstructors.status === RequestStatus.LOADING;

  const selectColumn = {
    id: 'selection',
    Header: <></>, // eslint-disable-line react/jsx-no-useless-fragment
    Cell: ControlledSelect,
    disableSortBy: true,
  };

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  useImperativeHandle(ref, () => ({
    clearSelectionFunc: () => clearSelectionRef?.current?.click(),
  }));

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      const instructorFilters = stateInstructors.filters;
      dispatch(fetchInstructorsData(selectedInstitution.id, currentPage, instructorFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedInstitution, dispatch]);

  return (
    <Container size="xl" className="p-4 mt-3 instructors-content">
      <h3>Assign / Add instructors</h3>
      <InstructorsFilters isAssignSection resetPagination={resetPagination} />
      <Row className="justify-content-center my-4 my-3 px-3">
        <Col xs={12} className="p-0">
          <DataTable
            isLoading={isLoading}
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
            bulkActions={[
              <ClearAction clearSelectionRef={clearSelectionRef} />,
            ]}
          >
            <DataTable.TableControlBar />
            <DataTable.Table />
            <DataTable.EmptyTable content="No instructors found." />
          </DataTable>
        </Col>
      </Row>
      {stateInstructors.numPages > 1 && (
        <Pagination
          paginationLabel="paginationNavigation"
          pageCount={stateInstructors.numPages}
          currentPage={currentPage}
          onPageSelect={handlePagination}
          variant="reduced"
          className="mx-auto pagination-table"
          size="small"
        />
      )}
    </Container>
  );
});

export default AssignSection;
