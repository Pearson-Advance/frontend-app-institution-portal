import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Container, Pagination } from '@edx/paragon';
import { useDispatch, useSelector } from 'react-redux';

import Table from 'features/Main/Table';
import InstructorCard from 'features/Classes/InstructorCard';
import Actions from 'features/Classes/Class/ClassPage/Actions';
import { Button } from 'react-paragon-topaz';

import { updateActiveTab } from 'features/Main/data/slice';
import { columns } from 'features/Classes/Class/ClassPage/columns';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';
import { fetchStudentsData } from 'features/Students/data';

import { initialPage, RequestStatus } from 'features/constants';
import { resetClassesTable, resetClasses } from 'features/Classes/data/slice';
import { fetchAllClassesData } from 'features/Classes/data/thunks';

import { useInstitutionIdQueryParam } from 'hooks';

import 'features/Classes/Class/ClassPage/index.scss';

const ClassPage = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { courseId, classId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const previousPage = queryParams.get('previous') || 'classes';
  const courseIdDecoded = decodeURIComponent(courseId);
  const classIdDecoded = decodeURIComponent(classId);

  const COLUMNS = useMemo(() => columns, []);

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const institution = useSelector((state) => state.main.selectedInstitution);
  const students = useSelector((state) => state.students.table);
  const addQueryParam = useInstitutionIdQueryParam();

  const isLoadingStudents = students.status === RequestStatus.LOADING;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const defaultClassInfo = useMemo(() => ({
    className: '',
  }), []);

  const classInfo = useSelector((state) => state.classes.allClasses.data)
    .find((classElement) => classElement?.classId === classIdDecoded) || defaultClassInfo;

  useEffect(() => {
    const initialTitle = document.title;

    document.title = classIdDecoded;
    // Leaves a gap time space to prevent being override by ActiveTabUpdater component
    setTimeout(() => dispatch(updateActiveTab('classes')), 100);

    return () => {
      document.title = initialTitle;
    };
  }, [dispatch, classIdDecoded]);

  useEffect(() => {
    if (institution.id) {
      const params = {
        course_id: courseIdDecoded,
        class_id: classIdDecoded,
        limit: true,
      };

      dispatch(fetchStudentsData(institution.id, currentPage, params));
    }

    return () => {
      dispatch(resetStudentsTable());
      dispatch(updateCurrentPage(initialPage));
    };
  }, [dispatch, institution.id, courseIdDecoded, classIdDecoded, currentPage]);

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchAllClassesData(institution.id, courseIdDecoded));
    }

    return () => {
      dispatch(resetClassesTable());
      dispatch(resetClasses());
    };
  }, [dispatch, institution.id, courseIdDecoded]);

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push(addQueryParam('/courses'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, history]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Button onClick={() => history.goBack()} className="mr-3 link back-arrow" variant="tertiary">
            <i className="fa-solid fa-arrow-left" />
          </Button>
          <h3 className="h2 mb-0 course-title">Class details: {classInfo.className}</h3>
        </div>
      </div>

      <div className="class-wrapper">
        <InstructorCard />
        <div>
          <div className="d-flex justify-content-end my-3 flex-wrap">
            <Actions previousPage={previousPage} />
          </div>
          <Table
            isLoading={isLoadingStudents}
            columns={COLUMNS}
            count={students.count}
            data={students.data}
            text="No students were found for this class."
          />
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
      </div>
    </Container>
  );
};

export default ClassPage;
