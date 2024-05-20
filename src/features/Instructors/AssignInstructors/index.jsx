// THIS FOLDER WILL BE REMOVED AFTER INTEGRATE ALL SECTIONS WITH NEW MANAGE INSTRUCTORS PAGE
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalDialog, ModalCloseButton, Pagination } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import AssignTable from 'features/Instructors/AssignInstructors/AssignTable';

import { fetchClassesData as fetchClassesDataHome } from 'features/Dashboard/data';
import { fetchInstructorsData, assignInstructors } from 'features/Instructors/data';
import {
  updateCurrentPage,
  updateFilters,
  updateClassSelected,
  resetRowSelect,
} from 'features/Instructors/data/slice';

import { initialPage } from 'features/constants';
import 'features/Instructors/AssignInstructors/index.scss';

const AssignInstructors = ({ isOpen, close, getClasses }) => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateInstructors = useSelector((state) => state.instructors);
  const rowsSelected = useSelector((state) => state.instructors.rowsSelected);
  const classId = useSelector((state) => state.instructors.classSelected);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const isButtonDisabled = rowsSelected.length === 0;

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const handleAssignInstructors = async () => {
    try {
      const dispatchPromises = rowsSelected.map(row => {
        const enrollmentData = new FormData();
        enrollmentData.append('unique_student_identifier', row);
        enrollmentData.append('rolename', 'staff');
        enrollmentData.append('action', 'allow');
        enrollmentData.append('class_id', classId);
        return dispatch(assignInstructors(enrollmentData));
      });

      await Promise.all(dispatchPromises);

      if (getClasses) {
        dispatch(fetchClassesDataHome(selectedInstitution.id));
      }
    } finally {
      close();
    }
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0 && isOpen) {
      const instructorFilters = stateInstructors.filters;
      dispatch(fetchInstructorsData(selectedInstitution.id, currentPage, instructorFilters));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedInstitution, dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(updateFilters({}));
      dispatch(updateClassSelected(''));
      dispatch(resetRowSelect());
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
        <InstructorsFilters isAssignSection resetPagination={resetPagination} />
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
          <ModalCloseButton className="btntpz btn-text btn-tertiary">Cancel</ModalCloseButton>
          <Button
            onClick={handleAssignInstructors}
            data-testid="assignButton"
            disabled={isButtonDisabled}
          >
            Assign instructor
          </Button>
        </div>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

AssignInstructors.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  getClasses: PropTypes.bool,
};

AssignInstructors.defaultProps = {
  getClasses: true,
};

export default AssignInstructors;
