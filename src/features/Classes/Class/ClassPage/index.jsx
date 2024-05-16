import React, { useState, useEffect, useRef } from 'react';
import {
  Link, useParams, useHistory, useLocation,
} from 'react-router-dom';
import { Button } from 'react-paragon-topaz';
import { getConfig } from '@edx/frontend-platform';
import { Container, Pagination } from '@edx/paragon';
import { useDispatch, useSelector } from 'react-redux';

import Table from 'features/Main/Table';
import EnrollStudent from 'features/Classes/EnrollStudent';
import InstructorCard from 'features/Classes/InstructorCard';

import { updateActiveTab } from 'features/Main/data/slice';
import { columns } from 'features/Classes/Class/ClassPage/columns';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';
import { fetchStudentsData } from 'features/Students/data';

import { initialPage } from 'features/constants';
import { resetClassesTable, resetClasses } from 'features/Classes/data/slice';
import { fetchAllClassesData } from 'features/Classes/data/thunks';

const ClassPage = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { courseId, classId } = useParams();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const institution = useSelector((state) => state.main.selectedInstitution);
  const students = useSelector((state) => state.students.table);

  const queryParams = new URLSearchParams(location.search);
  const queryClassId = queryParams.get('classId')?.replaceAll(' ', '+');
  const classLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${queryClassId}/home`;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const handleEnrollStudentModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const initialTitle = document.title;

    document.title = classId;
    // Leaves a gap time space to prevent being override by ActiveTabUpdater component
    setTimeout(() => dispatch(updateActiveTab('classes')), 100);

    return () => {
      document.title = initialTitle;
    };
  }, [dispatch, classId]);

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
    if (institution.id) {
      dispatch(fetchAllClassesData(institution.id, courseId));
    }

    return () => {
      dispatch(resetClassesTable());
      dispatch(resetClasses());
    };
  }, [dispatch, institution.id, courseId]);

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push('/courses');
    }
  }, [institution, history]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <EnrollStudent isOpen={isModalOpen} onClose={handleEnrollStudentModal} queryClassId={queryClassId} />
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Link to={`/courses/${courseId}`} className="mr-3 link">
            <i className="fa-solid fa-arrow-left" />
          </Link>
          <h3 className="h2 mb-0 course-title">Class details: {classId}</h3>
        </div>
        <Button
          as="a"
          href={classLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-white button-view-class"
        >
          <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />View class
        </Button>
      </div>

      <div className="d-flex flex-column">
        <InstructorCard />
        <div className="d-flex justify-content-end mb-3">
          <Button className="button-assign mb-2" onClick={handleEnrollStudentModal}>
            Invite student to enroll
          </Button>
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
      </div>
    </Container>
  );
};

export default ClassPage;
