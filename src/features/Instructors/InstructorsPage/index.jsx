import React, { useEffect, useState, useReducer } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';

import { logError } from '@edx/frontend-platform/logging';
import Container from '@edx/paragon/dist/Container';
import {
  Pagination,
} from '@edx/paragon';
import InstructorsTable from 'features/Instructors/InstructorsTable';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';

import { getInstructorData } from 'features/Instructors/data/api';
import {
  FETCH_INSTRUCTOR_DATA_REQUEST,
  FETCH_INSTRUCTOR_DATA_SUCCESS,
  FETCH_INSTRUCTOR_DATA_FAILURE,
  UPDATE_CURRENT_PAGE,
} from 'features/Instructors/actionTypes';
import { RequestStatus } from 'features/constants';
import reducer from 'features/Instructors/InstructorsPage/reducer';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
  currentPage: 1,
  numPages: 0,
};

const InstructorsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (filters) => {
    dispatch({ type: FETCH_INSTRUCTOR_DATA_REQUEST });

    try {
      const response = camelCaseObject(await getInstructorData(currentPage, filters));
      dispatch({ type: FETCH_INSTRUCTOR_DATA_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_INSTRUCTOR_DATA_FAILURE, payload: error });
      logError(error);
    }
  };

  useEffect(() => {
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch({ type: UPDATE_CURRENT_PAGE, payload: targetPage });
    fetchData();
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return (
    <Container size="xl" className="px-3">
      <h2>Instructors</h2>
      <div className="d-flex justify-content-end">
        <InstructorsFilters fetchData={fetchData} resetPagination={resetPagination} />
      </div>

      <InstructorsTable
        data={state.data}
        count={state.count}
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

export default InstructorsPage;
