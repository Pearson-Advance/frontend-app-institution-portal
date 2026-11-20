import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Container, Pagination } from '@openedx/paragon';

import ProgramsTable from 'features/Programs/ProgramsTable';
import { useGetProgramsListQuery } from 'features/Programs/data/programsApi';
import { updateCurrentPage } from 'features/Programs/data/slice';

const ProgramsPage = () => {
  const dispatch = useDispatch();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const { currentPage } = useSelector((state) => state.programs);

  const {
    data: programsResponse = { results: [], count: 0, numPages: 0 },
    isLoading: isLoadingPrograms,
  } = useGetProgramsListQuery(
    {
      institutionId: institution?.id,
      page: currentPage,
    },
    { skip: !institution?.id },
  );

  const handlePagination = (targetPage) => {
    dispatch(updateCurrentPage(targetPage));
  };

  return (
    <Container className="px-5">
      <h2 className="title-page">Programs</h2>
      <div className="page-content-container">
        <ProgramsTable
          data={programsResponse.results}
          count={programsResponse.count}
          isLoading={isLoadingPrograms}
        />
        {programsResponse.numPages > 1 && (
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
