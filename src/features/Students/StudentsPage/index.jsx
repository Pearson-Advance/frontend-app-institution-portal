import { getStudentbyInstitutionAdmin } from 'features/Students/data/api';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import StudentsFilters from 'features/Students/StudentsFilters';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Students/StudentsPage/reducer';

import { logError } from '@edx/frontend-platform/logging';
import Container from '@edx/paragon/dist/Container';

import React, { useEffect, useState, useReducer } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  Pagination,
} from '@edx/paragon';
import {
  FETCH_STUDENTS_DATA_REQUEST,
  FETCH_STUDENTS_DATA_SUCCESS,
  FETCH_STUDENTS_DATA_FAILURE,
  UPDATE_CURRENT_PAGE,
} from 'features/Students/actionTypes';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
  currentPage: 1,
  numPages: 0,
};

const StudentsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const fetchData = async (filtersData) => {
    dispatch({ type: FETCH_STUDENTS_DATA_REQUEST });

    try {
      const response = camelCaseObject(await getStudentbyInstitutionAdmin(currentPage, filtersData));
      dispatch({ type: FETCH_STUDENTS_DATA_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_STUDENTS_DATA_FAILURE, payload: error });
      logError(error);
    }
  };

  useEffect(() => {
    fetchData(filters); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch({ type: UPDATE_CURRENT_PAGE, payload: targetPage });
  };

  return (
    <Container size="xl">
      <h2 className="title-page">Students</h2>
      <StudentsMetrics />
      <div className="page-content-container">
        <StudentsFilters fetchData={fetchData} resetPagination={resetPagination} setFilters={setFilters} />
        <StudentsTable
          data={state.data}
          count={state.count}
          fetchData={fetchData}
        />
        {state.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={state.numPages}
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

export default StudentsPage;
