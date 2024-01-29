import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@edx/paragon/dist/Container';
import LicensesTable from 'features/Licenses/LicensesTable';
import { Pagination } from '@edx/paragon';

import { fetchLicensesData } from 'features/Licenses/data';
import { updateCurrentPage } from 'features/Licenses/data/slice';
import { initialPage } from 'features/constants';

const LicensesPage = () => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateLicenses = useSelector((state) => state.licenses.table);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchLicensesData(selectedInstitution?.id, currentPage));
    }
  }, [currentPage, selectedInstitution, dispatch]);

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">License pool inventory</h2>
      <div className="page-content-container">
        <LicensesTable
          data={stateLicenses.data}
          count={stateLicenses.count}
        />
        {stateLicenses.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={stateLicenses.numPages}
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
