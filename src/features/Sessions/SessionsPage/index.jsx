import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Pagination } from '@openedx/paragon';

import SessionsTable from 'features/Sessions/SessionsTable';
import StatusFilters from 'features/Common/StatusFilters';

import { useGetSessionsListQuery } from 'features/Sessions/data/sessionsApi';
import { updateCurrentPage, updateFilters } from 'features/Sessions/data/slice';
import { STATUS_TABS_VISIBILITY } from 'features/constants';
import { useInstitutionIdQueryParam } from 'hooks';

const SessionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addQueryParam = useInstitutionIdQueryParam();
  const institutionRef = useRef(undefined);

  const [statusFilter, setStatusFilter] = useState(STATUS_TABS_VISIBILITY.VISIBLE);

  const { currentPage, filters } = useSelector((state) => state.sessions);
  const institution = useSelector((state) => state.main.selectedInstitution);

  const {
    data: sessionsResponse = { results: [], count: 0, numPages: 0 },
    isLoading: isLoadingSessions,
  } = useGetSessionsListQuery(
    {
      institutionId: institution?.id,
      page: currentPage,
      params: filters,
    },
    { skip: !institution?.id },
  );

  const handlePagination = (targetPage) => {
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (institution?.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution?.id !== institutionRef.current) {
      navigate(addQueryParam('/programs'));
    }
  }, [institution, navigate, addQueryParam]);

  return (
    <Container className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h2 mb-0 session-title">Sessions</h2>
        </div>
      </div>

      <div className="page-content-container px-2">
        <div className="mw-100">
          <StatusFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectFilters={filters}
            updateFiltersAction={updateFilters}
            updateCurrentPageAction={updateCurrentPage}
            classnames="mb-3"
          />
        </div>
        <SessionsTable
          isLoading={isLoadingSessions}
          count={sessionsResponse.count}
          data={sessionsResponse.results}
        />
        {sessionsResponse.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={sessionsResponse.numPages}
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

export default SessionsPage;
