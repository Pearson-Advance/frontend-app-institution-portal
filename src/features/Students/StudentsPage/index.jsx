import { getStudentbyInstitutionAdmin } from 'features/Students/data/api';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import { StudentsFilters } from 'features/Students/StudentsFilters';
import { RequestStatus } from 'features/constants';

import { logError } from '@edx/frontend-platform/logging';
import Container from '@edx/paragon/dist/Container';
import { MenuIcon } from '@edx/frontend-component-header/dist/Icons';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useReducer } from 'react';
import {
  ActionRow,
  Button,
  Icon,
  IconButton,
  OverlayTrigger,
  Tooltip,
  Pagination,
  Modal,
} from '@edx/paragon';

const initialFilterFormValues = {
  learnerName: '',
  learnerEmail: '',
  instructor: '',
  ccxId: '',
};

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
  itemsPerPage: 10,
  currentPage: 1,
  numPages: 0,
  filters: {
    isOpenFilters: false,
    erros: {},
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, status: RequestStatus.LOADING };
    case 'FETCH_SUCCESS': {
      const { results, count } = action.payload;
      const numPages = Math.ceil(count / state.itemsPerPage);
      return {
        ...state,
        status: RequestStatus.SUCCESS,
        data: results,
        numPages,
        count,
      };
    }
    case 'FETCH_FAILURE':
      return {
        ...state,
        status: RequestStatus.ERROR,
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
          isOpenFilters: true,
        },
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        filters: {
          ...state.filters,
          isOpenFilters: false,
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
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleOpenFiltersModal = () => {
    dispatch({ type: 'OPEN_MODAL' });
  };

  const handleCloseFiltersModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleApplyFilters = async () => {
    fetchData();
    handleCloseFiltersModal();
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
        title="StudentsFilters"
        open={state.filters.isOpenFilters}
        body={
          <StudentsFilters filters={filters} setFilters={setFilters} />
        }
        onClose={handleCloseFiltersModal}
        buttons={
          [<Button onClick={handleApplyFilters} variant="light">Apply Filters</Button>]
        }
      />
      <ActionRow>
        <IconButton
          src={MenuIcon}
          iconAs={Icon}
          alt="Menu"
          onClick={handleOpenFiltersModal}
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
        data={state.data}
        count={state.count}
        fetchData={fetchData}
      />
      <Pagination
        paginationLabel="paginationNavigation"
        pageCount={state.numPages}
        currentPage={currentPage}
        onPageSelect={handlePagination}
        variant="reduced"
        className="mx-auto"
        size="small"
      />
    </Container>
  );
};

export default StudentsPage;
