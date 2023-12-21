import React, {
  useEffect, useState, useReducer, useContext,
} from 'react';
import { camelCaseObject } from '@edx/frontend-platform';

import { logError } from '@edx/frontend-platform/logging';
import Container from '@edx/paragon/dist/Container';
import { Pagination } from '@edx/paragon';
import CoursesTable from 'features/Courses/CoursesTable';
import CoursesFilters from 'features/Courses/CoursesFilters';
import reducer from 'features/Courses/CoursesPage/reducer';
import { InstitutionContext } from 'features/Main/institutionContext';

import { getCoursesByInstitution } from 'features/Common/data/api';
import {
  FETCH_COURSES_DATA_REQUEST,
  FETCH_COURSES_DATA_SUCCESS,
  FETCH_COURSES_DATA_FAILURE,
  UPDATE_CURRENT_PAGE,
} from 'features/Courses/actionTypes';
import { RequestStatus } from 'features/constants';

const initialState = {
  data: [],
  status: RequestStatus.SUCCESS,
  error: null,
  currentPage: 1,
  numPages: 0,
};

const CoursesPage = () => {
  const stateInstitution = useContext(InstitutionContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  // check this after implementation of selector institution
  let id = '';
  if (stateInstitution.length === 1) {
    id = stateInstitution[0].id;
  }

  const fetchData = async (filtersData) => {
    dispatch({ type: FETCH_COURSES_DATA_REQUEST });

    try {
      const response = camelCaseObject(await getCoursesByInstitution(id, true, currentPage, filtersData));
      dispatch({ type: FETCH_COURSES_DATA_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_COURSES_DATA_FAILURE, payload: error });
      logError(error);
    }
  };

  useEffect(() => {
    fetchData(filters);
  }, [currentPage, id, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch({ type: UPDATE_CURRENT_PAGE, payload: targetPage });
    fetchData();
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">Courses</h2>
      <div className="page-content-container">
        <CoursesFilters
          dataCourses={state.data}
          fetchData={fetchData}
          resetPagination={resetPagination}
          setFilters={setFilters}
        />
        <CoursesTable
          data={state.data}
          count={state.count}
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

export default CoursesPage;
