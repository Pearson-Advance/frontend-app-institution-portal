import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Pagination, Container } from '@openedx/paragon';

import { initialPage } from 'features/constants';
import { updateCurrentPage, updateFilters, resetLicensesTable } from 'features/Licenses/data/slice';
import { fetchLicensesData } from 'features/Licenses/data';
import LicensesTable from 'features/Licenses/LicensesTable';
import LicensesFilters from 'features/Licenses/LicensesFilters';

const LicensesPage = () => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateLicenses = useSelector((state) => state.licenses);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchLicensesData(selectedInstitution.id, currentPage));
    }

    return () => {
      dispatch(resetLicensesTable());
      dispatch(updateFilters({}));
    };
  }, [selectedInstitution, dispatch, currentPage]);

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">License pool inventory</h2>
      <div className="page-content-container">
        <LicensesFilters resetPagination={resetPagination} />
        <LicensesTable
          data={stateLicenses.table.data}
          count={stateLicenses.table.count}
        />
        {stateLicenses.table.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={stateLicenses.table.numPages}
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

export default LicensesPage;
