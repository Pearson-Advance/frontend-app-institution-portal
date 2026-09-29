import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Link } from 'react-router-dom';

import { Pagination, useToggle, Container } from '@openedx/paragon';
import InstructorsTable from 'features/Instructors/InstructorsTable';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import InstructorForm from 'features/Instructors/InstructorForm';
import StatusFilters from 'features/Instructors/StatusFilters';
import { Button } from 'react-paragon-topaz';

import { updateCurrentPage, updateFilters, resetInstructorsRequest } from 'features/Instructors/data/slice';
import { initialPage, INSTRUCTOR_STATUS_TABS } from 'features/constants';

import './index.scss';

const InstructorsPage = () => {
  const enableBulkRegistration = getConfig()?.PSS_ENABLE_BULK_REGISTRATION_INSTRUCTORS || false;
  const stateInstructors = useSelector((state) => state.instructors);
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [statusFilter, setStatusFilter] = useState(INSTRUCTOR_STATUS_TABS.ACTIVE);
  const [isOpen, openModal, closeModal] = useToggle(false);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length === 0) { return undefined; }

    return () => {
      dispatch(resetInstructorsRequest());
      dispatch(updateFilters({}));
    };
  }, [selectedInstitution, dispatch]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  const handleResetFilters = () => {
    setStatusFilter(INSTRUCTOR_STATUS_TABS.ACTIVE);
  };

  return (
    <Container className="px-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="title-page">Instructors</h2>
        <div className="d-flex align-items-center">
          <Button onClick={openModal}>
            Add new instructor
          </Button>
          {enableBulkRegistration && selectedInstitution?.hasBulkRegister && (
          <Link to="/instructors/bulk-registration" className="bulk-registration__link bulk-instructors ml-2" disabled={!enableBulkRegistration}>
            Bulk Registration
          </Link>
          )}
          <InstructorForm
            isOpen={isOpen}
            onClose={closeModal}
          />
        </div>
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
