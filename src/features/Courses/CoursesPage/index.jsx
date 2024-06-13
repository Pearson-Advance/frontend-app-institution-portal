import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@edx/paragon/dist/Container';
import { Pagination } from '@edx/paragon';
import CoursesTable from 'features/Courses/CoursesTable';
import CoursesFilters from 'features/Courses/CoursesFilters';

import { updateCurrentPage, resetCoursesTable } from 'features/Courses/data/slice';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { initialPage } from 'features/constants';

const CoursesPage = () => {
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const stateCourses = useSelector((state) => state.courses);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchCoursesData(selectedInstitution.id, initialPage));
    }

    return () => {
      dispatch(resetCoursesTable());
    };
  }, [selectedInstitution, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (Object.keys(selectedInstitution).length > 0) {
      dispatch(fetchCoursesData(selectedInstitution.id, currentPage, stateCourses.filters));
    }
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const resetPagination = () => {
    setCurrentPage(initialPage);
  };

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">Courses</h2>
      <div className="page-content-container">
        <CoursesFilters resetPagination={resetPagination} />
        <CoursesTable
          data={stateCourses.table.data}
          count={stateCourses.table.count}
        />
        {stateCourses.table.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={stateCourses.table.numPages}
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

export default CoursesPage;
