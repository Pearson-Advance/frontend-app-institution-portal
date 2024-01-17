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
  const stateInstitution = useSelector((state) => state.main.institution.data);
  const stateLicenses = useSelector((state) => state.licenses.table);
  const [currentPage, setCurrentPage] = useState(initialPage);

  let idInstitution = '';
  // eslint-disable-next-line no-unused-expressions
  stateInstitution.length > 0 ? idInstitution = stateInstitution[0].id : idInstitution = '';

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    dispatch(fetchLicensesData(idInstitution));
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

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
