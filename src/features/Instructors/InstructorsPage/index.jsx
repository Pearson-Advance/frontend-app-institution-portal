import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@edx/paragon/dist/Container';
import { Pagination, useToggle } from '@edx/paragon';
import InstructorsTable from 'features/Instructors/InstructorsTable';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import InstructorForm from 'features/Instructors/InstructorForm';
import StatusFilters from 'features/Instructors/StatusFilters';
import { Button } from 'react-paragon-topaz';

import { updateCurrentPage, updateFilters, resetInstructorsRequest } from 'features/Instructors/data/slice';
import { fetchInstructorsData } from 'features/Instructors/data/thunks';
import { initialPage, INSTRUCTOR_STATUS_TABS } from 'features/constants';

const InstructorsPage = () => {
  const stateInstructors = useSelector((state) => state.instructors);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [statusFilter, setStatusFilter] = useState(INSTRUCTOR_STATUS_TABS.ALL);
  const [isOpen, openModal, closeModal] = useToggle(false);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchInstructorsData(selectedInstitution.id, currentPage));
    }

    return () => {
      dispatch(resetInstructorsRequest());
      dispatch(updateFilters({}));
    };
  }, [selectedInstitution, dispatch, currentPage]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  const handleResetFilters = () => {
    setStatusFilter(INSTRUCTOR_STATUS_TABS.ALL);
  };

  return (
    <Container size="xl" className="px-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="title-page">Instructors</h2>
        <Button onClick={openModal}>
          Add new instructor
        </Button>
        <InstructorForm
          isOpen={isOpen}
          onClose={closeModal}
        />
      </div>
      <div className="page-content-container">
        <InstructorsFilters resetPagination={resetPagination} onResetFilters={handleResetFilters} />

        <StatusFilters
          currentPage={currentPage}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <InstructorsTable
          data={stateInstructors.table.data}
          count={stateInstructors.table.count}
        />
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
      </div>
    </Container>
  );
};

export default InstructorsPage;
