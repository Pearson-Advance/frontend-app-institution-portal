import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Container, Pagination } from '@openedx/paragon';

import ErrorMessage from 'features/Main/ErrorMessage';
import ProgramsFilters from 'features/Programs/ProgramsFilters';
import ProgramsTable from 'features/Programs/ProgramsTable';
import { useGetProgramsListQuery } from 'features/Programs/data/programsApi';
import { updateCurrentPage, updateFilters, resetProgramsTable } from 'features/Programs/data/slice';
import { initialPage } from 'features/constants';

const ProgramsPage = () => {
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const { currentPage, filters } = useSelector((state) => state.programs);

  const {
    data: programsResponse = { results: [], count: 0, numPages: 0 },
    isFetching: isLoadingPrograms,
    isError: isErrorPrograms,
  } = useGetProgramsListQuery(
    {
      institutionId: institution?.id,
      page: currentPage,
      params: filters,
    },
    { skip: !institution?.id },
  );

  useEffect(() => {
    dispatch(updateCurrentPage(initialPage));
  }, [institution?.id, dispatch]);

  useEffect(() => () => {
    dispatch(resetProgramsTable());
  }, [dispatch]);

  const handlePagination = (targetPage) => {
    dispatch(updateCurrentPage(targetPage));
  };

  const handleApplyFilters = (newFilters) => {
    dispatch(updateFilters(newFilters));
    dispatch(updateCurrentPage(initialPage));
  };

  return (
    <Container className="px-5">
      <h2 className="title-page">Programs</h2>
      <div className="page-content-container">
        <div className="filter-container justify-content-center row">
          <ProgramsFilters onApplyFilters={handleApplyFilters} />
        </div>
        {isErrorPrograms && !isLoadingPrograms ? (
          <div className="py-5">
            <ErrorMessage message="Unable to load programs. Please try again later." />
          </div>
        ) : (
          <ProgramsTable
            data={programsResponse.results}
            count={programsResponse.count}
            isLoading={isLoadingPrograms}
          />
        )}
        {!isErrorPrograms && programsResponse.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={programsResponse.numPages}
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

export default ProgramsPage;
