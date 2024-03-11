import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Pagination } from '@edx/paragon';
import Table from 'features/Main/Table';

import { columns } from 'features/Classes/Class/ClassPage/columns';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';
import { fetchStudentsData } from 'features/Students/data';

import { initialPage } from 'features/constants';

const ClassPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { courseId, classId } = useParams();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const institution = useSelector((state) => state.main.selectedInstitution);
  const students = useSelector((state) => state.students.table);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    const initialTitle = document.title;

    document.title = classId;

    return () => {
      document.title = initialTitle;
    };
  }, [classId]);

  useEffect(() => {
    if (institution.id) {
      const params = {
        course_name: courseId,
        class_name: classId,
        limit: true,
      };
      dispatch(fetchStudentsData(institution.id, currentPage, params));
    }

    return () => {
      dispatch(resetStudentsTable());
      dispatch(updateCurrentPage(initialPage));
    };
  }, [dispatch, institution.id, courseId, classId, currentPage]);

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push('/courses');
    }
  }, [institution, history]);

  return (
    <Container size="xl" className="px-4">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Link to={`/courses/${courseId}`} className="mr-3 link">
            <i className="fa-solid fa-arrow-left" />
          </Link>
          <h3 className="h2 mb-0 course-title">Class details: {classId}</h3>
        </div>
      </div>

      <Table columns={columns} count={students.count} data={students.data} text="No students were found for this class." />
      {students.numPages > 1 && (
      <Pagination
        paginationLabel="paginationNavigation"
        pageCount={students.numPages}
        currentPage={currentPage}
        onPageSelect={handlePagination}
        variant="reduced"
        className="mx-auto pagination-table"
        size="small"
      />
      )}
    </Container>
  );
};

export default ClassPage;
