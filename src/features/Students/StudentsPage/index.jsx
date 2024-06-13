import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StudentsTable } from 'features/Students/StudentsTable/index';
import StudentsFilters from 'features/Students/StudentsFilters';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import Container from '@edx/paragon/dist/Container';
import { Pagination } from '@edx/paragon';
import { updateCurrentPage, resetStudentsTable } from 'features/Students/data/slice';
import { fetchStudentsData } from 'features/Students/data/thunks';
import { initialPage } from 'features/constants';

const StudentsPage = () => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateStudents = useSelector((state) => state.students);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchStudentsData(selectedInstitution.id, initialPage));
    }

    return () => {
      dispatch(resetStudentsTable());
    };
  }, [selectedInstitution, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchStudentsData(selectedInstitution.id, currentPage, stateStudents.filters));
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">Students</h2>
      <StudentsMetrics />
      <div className="page-content-container">
        <StudentsFilters resetPagination={resetPagination} />
        <StudentsTable
          data={stateStudents.table.data}
          count={stateStudents.table.count}
        />
        {stateStudents.table.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={stateStudents.table.numPages}
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

export default StudentsPage;
