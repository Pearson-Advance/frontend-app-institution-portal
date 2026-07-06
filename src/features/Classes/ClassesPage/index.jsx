import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Pagination } from '@openedx/paragon';
import { useLocation } from 'react-router-dom';

import ClassesTable from 'features/Classes/ClassesTable';
import ClassesFilters from 'features/Classes/ClassesFilters';

import { updateCurrentPage } from 'features/Classes/data/slice';
import { useGetClassesQuery } from 'features/Classes/data/classesApi';
import { initialPage } from 'features/constants';

const ClassesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const storedFilters = useSelector((state) => state.classes.filters);
  const currentPage = useSelector((state) => state.classes.table.currentPage) || initialPage;
  const resetFiltersRef = useRef(false);

  const queryParams = new URLSearchParams(location.search);
  const queryNotInstructors = queryParams.get('instructors');

  const isForcedInstructorsView = queryNotInstructors === 'null' && !resetFiltersRef.current;
  const filters = isForcedInstructorsView ? { instructors: queryNotInstructors } : storedFilters;

  const institutionId = selectedInstitution?.id;

  const { data, isFetching } = useGetClassesQuery(
    { institutionId, page: currentPage, filters },
    { skip: !institutionId },
  );

  const classes = data?.results || [];
  const count = data?.count || 0;
  const numPages = data?.numPages || 0;

  const handlePagination = (targetPage) => {
    dispatch(updateCurrentPage(targetPage));
  };

  const resetPagination = () => {
    dispatch(updateCurrentPage(initialPage));
    resetFiltersRef.current = true;
  };

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">Classes</h2>
      <div className="page-content-container">
        <ClassesFilters resetPagination={resetPagination} />
        <ClassesTable
          data={classes}
          count={count}
          isLoading={isFetching}
        />
        {numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={numPages}
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

export default ClassesPage;
