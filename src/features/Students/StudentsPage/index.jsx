import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '@edx/paragon';
import { Link } from 'react-router-dom';

import { StudentsTable } from 'features/Students/StudentsTable/index';
import StudentsFilters from 'features/Students/StudentsFilters';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import Container from '@edx/paragon/dist/Container';
import { updateCurrentPage, updateFilters, resetStudentsTable } from 'features/Students/data/slice';
import { fetchStudentsData } from 'features/Students/data/thunks';
import { initialPage } from 'features/constants';

import './index.scss';

const StudentsPage = () => {
  const dispatch = useDispatch();
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateStudents = useSelector((state) => state.students);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchStudentsData(selectedInstitution.id, currentPage));
    }

    return () => {
      dispatch(resetStudentsTable());
      dispatch(updateFilters({}));
    };
  }, [selectedInstitution, dispatch, currentPage]);

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
        <div className="bulk-registration">
          <Link to="/students/bulk-registration" className="bulk-registration__link">
            Bulk registration
          </Link>
        </div>
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
