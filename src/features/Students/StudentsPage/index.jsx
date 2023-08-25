import React, { useEffect, useMemo, useState  } from 'react';
import { useStudentEnrollments } from 'features/Students/data/slices';
import { fetchStudentEnrollments } from 'features/Students/data/thunks';

import Container from '@edx/paragon/dist/Container';
import { getColumns } from 'features/Students/StudentsTable/columns';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import {
  ActionRow, Button, Icon, IconButton, OverlayTrigger, Tooltip
} from '@edx/paragon';
import { MenuIcon } from '@edx/paragon/icons';

import {
  Pagination, Modal,
} from '@edx/paragon';
import { Filters } from '../StudentsFilters';
import { faDownload, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';



const initialFilterFormValues = {
  learnerName: '',
  learnerEmail: '',
  instructor: '',
  ccxId: '',
}

const StudentsPage = () => {
  const { state, dispatch, openModal, closeModal } = useStudentEnrollments();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilterFormValues);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchStudentEnrollments(dispatch);
      } catch (error) {
        // Handle error if needed
      }
    };

    fetchData();
  }, [dispatch]);

  const COLUMNS = useMemo(() => getColumns(), [open]);

  const handleCloseModal = (e) => {
    setFilters(initialFilterFormValues);
    closeModal();
  };

  const handleOpenModal = () => {
    setFilters(initialFilterFormValues);
    openModal()
  };

  const handleApplyFilters = () => {
    setFilters(initialFilterFormValues)

    fetchStudentEnrollments(dispatch, state.currentPage, filters);
    handleCloseModal();
  }

  const handleCleanFilters = () => {
    fetchStudentEnrollments(dispatch, state.currentPage, initialFilterFormValues);
    setFilters(initialFilterFormValues);
  }

  const handlePagination = async (targetPage) => {
    setCurrentPage(targetPage);

    dispatch({ type: 'UPDATE_CURRENT_PAGE', payload: targetPage });

    const fetchData = () => {
      try {
        fetchStudentEnrollments(dispatch, targetPage, filters);
      } catch (error) {
        // Handle error if needed
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
        buttons={[<Button onClick={handleApplyFilters} variant="light">Apply Filters</Button>]}
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
