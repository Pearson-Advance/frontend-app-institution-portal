import { getStudentbyInstitutionAdmin } from 'features/Students/data/api';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import { StudentsFilters } from 'features/Students/StudentsFilters';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Students/StudentsPage/reducer';

import { logError } from '@edx/frontend-platform/logging';
import Container from '@edx/paragon/dist/Container';
import { MenuIcon } from '@edx/frontend-component-header/dist/Icons';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useReducer } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
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
import {
  FETCH_STUDENTS_DATA_REQUEST,
  FETCH_STUDENTS_DATA_SUCCESS,
  FETCH_STUDENTS_DATA_FAILURE,
  UPDATE_CURRENT_PAGE,
  OPEN_MODAL,
  CLOSE_MODAL,
} from 'features/Students/actionTypes';

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
  currentPage: 1,
  numPages: 0,
  filters: {
    isOpenFilters: false,
    erros: {},
  },
};

const StudentsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilterFormValues);

  const fetchData = async () => {
    dispatch({ type: FETCH_STUDENTS_DATA_REQUEST });

    try {
      const response = camelCaseObject(await getStudentbyInstitutionAdmin(currentPage, filters));
      dispatch({ type: FETCH_STUDENTS_DATA_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_STUDENTS_DATA_FAILURE, payload: error });
      logError(error);
    }
  };

  useEffect(() => {
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleOpenFiltersModal = () => {
    dispatch({ type: OPEN_MODAL });
  };

  const handleCloseFiltersModal = () => {
    dispatch({ type: CLOSE_MODAL });
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
    dispatch({ type: UPDATE_CURRENT_PAGE, payload: targetPage });
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
