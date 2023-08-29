import React, { useEffect, useMemo, useState } from 'react';
import { useStudentEnrollments } from 'features/Students/data/slices';
import { fetchStudentEnrollments } from 'features/Students/data/thunks';

import Container from '@edx/paragon/dist/Container';
import { getColumns } from 'features/Students/StudentsTable/columns';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import {
  ActionRow, Button, Icon, IconButton, OverlayTrigger, Tooltip,
} from '@edx/paragon';
import { MenuIcon } from '@edx/paragon/icons';

import {
  Pagination, Modal,
} from '@edx/paragon';
import { Filters } from 'features/Students/StudentsFilters';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { logError } from '@edx/frontend-platform/logging';

const initialFilterFormValues = {
  learnerName: '',
  learnerEmail: '',
  instructor: '',
  ccxId: '',
}

const StudentsPage = () => {
  const { state, dispatch } = useStudentEnrollments();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilterFormValues);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchStudentEnrollments(dispatch);
      } catch (error) {
        logError(error);
      }
    };

    fetchData();
  }, [dispatch]);

  const COLUMNS = useMemo(() => getColumns(), [open]);

  const handleCloseModal = (e) => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleOpenModal = () => {
    dispatch({ type: 'OPEN_MODAL' });
  };

  const handleApplyFilters = () => {
    fetchStudentEnrollments(dispatch, currentPage, filters);
    handleCloseModal();
  }

  const handleCleanFilters = () => {
    fetchStudentEnrollments(dispatch, currentPage, initialFilterFormValues);
    setFilters(initialFilterFormValues);
  }

  const handlePagination = async (targetPage) => {
    setCurrentPage(targetPage);
    dispatch({ type: 'UPDATE_CURRENT_PAGE', payload: targetPage });

    const fetchData = () => {
      try {
        fetchStudentEnrollments(dispatch, targetPage, filters);
      } catch (error) {
        logError(error);
      }
    }; 

    fetchData();
  };

  return (
    <Container size="xl">
      <h1>Students</h1>
      <Modal
        title="Filters"
        open={state.filters.isOpen}
        body={
          <Filters
            filters={filters}
            setFilters={setFilters}
          />
        }
        onClose={handleCloseModal}
        buttons={
          [<Button onClick={handleApplyFilters} variant="light">Apply Filters</Button>]
        }
      />
      <ActionRow>
        <IconButton
          src={MenuIcon}
          iconAs={Icon}
          alt="Menu"
          onClick={handleOpenModal}
          variant="secondary"
          size="inline"
        />
        <h4>Filters</h4>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip variant="light">Clean filters</Tooltip>}
        >
          <IconButton icon={faTrash} alt="filter" onClick={handleCleanFilters} variant="secondary" />
        </OverlayTrigger>
      </ActionRow>
      <StudentsTable
        data={state.data || []}
        count={state.count}
        columns={COLUMNS}
      />
      <Pagination
        paginationLabel="paginationNavigation"
        pageCount={state.numPages}
        currentPage={state.currentPage}
        onPageSelect={handlePagination}
        variant="reduced"
        className="mx-auto"
        size='small'
      />
    </Container>
  );
};

export default StudentsPage;
