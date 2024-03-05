import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Pagination } from '@edx/paragon';

import ClassesTable from 'features/Classes/ClassesTable';
import ClassesFilters from 'features/Classes/ClassesFilters';

import { updateCurrentPage } from 'features/Classes/data/slice';
import { fetchClassesData } from 'features/Classes/data/thunks';
import { initialPage } from 'features/constants';

const ClassesPage = () => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateClasses = useSelector((state) => state.classes);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchClassesData(selectedInstitution.id, currentPage));
    }
  }, [currentPage, selectedInstitution, dispatch]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">Classes</h2>
      <div className="page-content-container">
        <ClassesFilters resetPagination={resetPagination} />
        <ClassesTable
          data={stateClasses.table.data}
          count={stateClasses.table.count}
        />
        {stateClasses.table.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={stateClasses.table.numPages}
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
