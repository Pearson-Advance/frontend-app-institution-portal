import React, { useEffect, useMemo, useReducer } from 'react';

import { getColumns } from 'features/Students/StudentsTable/columns';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import { getStudentbyInstitutionAdmin } from 'features/Students/data/api';
import { RequestStatus } from 'features/constants';

import Container from '@edx/paragon/dist/Container';
import { Pagination } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
  itemsPerPage: 10,
  currentPage: 1,
  numPages: 0,
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
      return { ...state, status: RequestStatus.ERROR, error: action.payload };
    case 'UPDATE_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};

const StudentsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });

    try {
      const response = await getStudentbyInstitutionAdmin(state.currentPage);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
      logError(error);
    }
  };

  useEffect(() => {
    fetchData();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [state.currentPage]);

  const handlePagination = (targetPage) => {
    dispatch({ type: 'UPDATE_CURRENT_PAGE', payload: targetPage });
    fetchData();
  };

  const COLUMNS = useMemo(() => getColumns(), []);

  return (
    <Container size="xl">
      <h1>Students</h1>
      <StudentsTable
        data={state.data}
        count={state.count}
        pageCount={state.numPages}
        columns={COLUMNS}
      />
      <Pagination
        paginationLabel="paginationNavigation"
        pageCount={state.numPages}
        currentPage={state.currentPage}
        onPageSelect={handlePagination}
        variant="reduced"
        className="mx-auto"
        size="small"
      />
    </Container>
  );
};

export default StudentsPage;
