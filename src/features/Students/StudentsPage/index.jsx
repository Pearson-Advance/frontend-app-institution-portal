import React, { useEffect, useMemo, useState, useReducer } from 'react';
import { getStudentbyInstitutionAdmin, handleEnrollments } from 'features/Students/data/api';
import { logError } from '@edx/frontend-platform/logging';
import Container from '@edx/paragon/dist/Container';
import { getColumns, hideColumns } from 'features/Students/StudentsTable/columns';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import { ActionRow, Button, Icon, IconButton, OverlayTrigger, Tooltip, Pagination, Modal, useToggle, AlertModal } from '@edx/paragon';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Filters } from 'features/Students/StudentsFilters';
import { MenuIcon } from '@edx/frontend-component-header/dist/Icons';

const initialFilterFormValues = {
  learnerName: '',
  learnerEmail: '',
  instructor: '',
  ccxId: '',
};

const initialState = {
  data: [],
  status: 'success',
  error: null,
  itemsPerPage: 10,
  currentPage: 1,
  numPages: 0,
  filters: {
    isOpen: false,
    erros: {},
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, status: 'loading' };
    case 'FETCH_SUCCESS':
      const { results, count } = action.payload;
      const numPages = Math.ceil(count / state.itemsPerPage);
      return {
        ...state,
        status: 'success',
        data: results,
        numPages: numPages,
        count: count,
      };
    case 'FETCH_FAILURE':
      return {
        ...state, status: 'error',
        error: action.payload,
      };
    case 'UPDATE_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        filters: {
          ...state.filters,
          isOpen: true,
        },
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        filters: {
          ...state.filters,
          isOpen: false,
          errors: {},
        },
      };
    default:
      return state;
  }
};

const StudentsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilterFormValues);
  const [isOpen, open, close] = useToggle(false);
  const [selectedRow, setRow] = useState({});

  const COLUMNS = useMemo(() => getColumns({ open, setRow }), [open]);
  const enrollmentData = new FormData();

  enrollmentData.append('identifiers', selectedRow.learner_email);
  enrollmentData.append('action', 'unenroll')

  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });

    try {
      const response = await getStudentbyInstitutionAdmin(currentPage, filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
      logError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, filters]);

  const handleAction = async () => {
    dispatch({ type: 'FETCH_REQUEST' });

    try {
      await handleEnrollments(enrollmentData, selectedRow.ccx_id);
      const response = await getStudentbyInstitutionAdmin(currentPage, filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      close();
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
      logError(error);
    }
  };

  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleOpenModal = () => {
    dispatch({ type: 'OPEN_MODAL' });
  };

  const handleApplyFilters = async () => {
    dispatch({ type: 'FETCH_REQUEST' });

    try {
      const response = await getStudentbyInstitutionAdmin(currentPage, filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      handleCloseModal();
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
      logError(error);
    }
  };

  const handleCleanFilters = () => {
    setFilters(initialFilterFormValues);
    setCurrentPage(1);
    fetchData();
  };

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch({ type: 'UPDATE_CURRENT_PAGE', payload: targetPage });
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
        hideColumns={hideColumns}
      />
      <Pagination
        paginationLabel="paginationNavigation"
        pageCount={state.numPages}
        currentPage={currentPage}
        onPageSelect={handlePagination}
        variant="reduced"
        className="mx-auto"
        size='small'
      />
      <AlertModal
        title={`Are you sure you want the learner's enrollment to be Revoked?`}
        isOpen={isOpen}
        onClose={close}
        footerNode={(
          <ActionRow>
            <Button variant="link" onClick={close}>cancel</Button>
            <Button variant="light" onClick={handleAction}>
              Submit
            </Button>
          </ActionRow>
        )}
      >
        <p>
          Learner with email <b>{selectedRow.learner_email}</b> will be revoked from <b>{selectedRow.ccx_name}</b> course.
        </p>
      </AlertModal>
    </Container>
  );
};

export default StudentsPage;
