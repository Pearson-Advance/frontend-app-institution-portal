import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalDialog, ModalCloseButton, Pagination } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import AssignTable from 'features/Instructors/AssignInstructors/AssignTable';

import { fetchInstructorsData, assignInstructors } from 'features/Instructors/data';
import {
  updateCurrentPage, updateRowsSelected, updateFilters, updateClassSelected,
} from 'features/Instructors/data/slice';

import { initialPage } from 'features/constants';
import 'features/Instructors/AssignInstructors/index.scss';

const AssignInstructors = ({ isOpen, close }) => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateInstructors = useSelector((state) => state.instructors);
  const rowsSelected = useSelector((state) => state.instructors.rowsSelected);
  const classId = useSelector((state) => state.instructors.classSelected);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const handleAssignInstructors = async () => {
    // eslint-disable-next-line array-callback-return
    rowsSelected.map(row => {
      const enrollmentData = new FormData();
      enrollmentData.append('unique_student_identifier', row);
      enrollmentData.append('rolename', 'staff');
      enrollmentData.append('action', 'allow');
      dispatch(assignInstructors(enrollmentData, classId, selectedInstitution.id));
    });
    close();
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchInstructorsData(selectedInstitution.id, currentPage, stateInstructors.filters));
    }
  }, [currentPage, selectedInstitution, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) {
      dispatch(updateRowsSelected([]));
      dispatch(updateFilters({}));
      dispatch(updateClassSelected(''));
    }
  }, [isOpen, dispatch]);

  return (
    <ModalDialog
      title="Assign instructor"
      isOpen={isOpen}
      onClose={close}
      hasCloseButton
      size="lg"
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          Assign instructor
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <InstructorsFilters isAssignModal resetPagination={resetPagination} />
        <AssignTable />
        {stateInstructors.table.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={stateInstructors.table.numPages}
            currentPage={currentPage}
            onPageSelect={handlePagination}
            variant="reduced"
            className="mx-auto pagination-table"
            size="small"
          />
        )}
        <div className="d-flex justify-content-end">
          <ModalCloseButton className="btntpz btn-text btn-tertiary">Close</ModalCloseButton>
          <Button onClick={handleAssignInstructors} data-testid="assignButton">Assign instructor</Button>
        </div>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

AssignInstructors.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default AssignInstructors;
