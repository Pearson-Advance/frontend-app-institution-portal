import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Pagination, useToggle } from '@edx/paragon';
import CourseDetailTable from 'features/Courses/CourseDetailTable';
import { Button } from 'react-paragon-topaz';
import { getConfig } from '@edx/frontend-platform';
import AddClass from 'features/Courses/AddClass';

import { fetchClassesData } from 'features/Classes/data/thunks';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { fetchClassesDataSuccess } from 'features/Classes/data/slice';
import { fetchCoursesDataSuccess, updateCurrentPage } from 'features/Courses/data/slice';
import { initialPage } from 'features/constants';

import 'features/Courses/CoursesDetailPage/index.scss';

const CoursesDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { courseName } = useParams();
  const courseNameDecoded = decodeURIComponent(courseName);

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isOpenModal, openModal, closeModal] = useToggle(false);

  const defaultCourseInfo = useMemo(() => ({
    numberOfStudents: '-',
    numberOfPendingStudents: '-',
    masterCourseId: '-',
  }), []);

  const courseInfo = useSelector((state) => state.courses.table.data)
    .find((course) => course?.masterCourseName === courseNameDecoded) || defaultCourseInfo;
  const lastCourseInfoRef = useRef(courseInfo);

  useEffect(() => {
    if (courseInfo !== defaultCourseInfo) {
      lastCourseInfoRef.current = courseInfo;
    }
  }, [courseInfo, defaultCourseInfo]);

  const nextCourseInfo = lastCourseInfoRef.current;
  const institution = useSelector((state) => state.main.selectedInstitution);
  const classes = useSelector((state) => state.classes.table);
  const totalStudents = nextCourseInfo.numberOfStudents + nextCourseInfo.numberOfPendingStudents;
  const courseDetailsLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${nextCourseInfo.masterCourseId}/home`;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    const initialState = {
      results: [],
      count: 0,
      numPages: 0,
    };

    if (institution.id) {
      dispatch(fetchClassesData(institution.id, initialPage, courseNameDecoded));
      dispatch(fetchCoursesData(institution.id, initialPage, null));
    }

    return () => {
      dispatch(fetchCoursesDataSuccess(initialState));
      dispatch(fetchClassesDataSuccess(initialState));
    };
  }, [dispatch, institution.id, courseNameDecoded]);

  useEffect(() => {
    dispatch(fetchClassesData(institution.id, currentPage, courseNameDecoded));
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Link to="/courses" className="mr-3 link">
            <i className="fa-solid fa-arrow-left" />
          </Link>
          <h3 className="h2 mb-0 course-title">{courseNameDecoded}</h3>
        </div>

        <div className="card-container d-flex justify-content-around align-items-center">
          <div className="d-flex flex-column align-items-center">
            <p className="title">Students enrolled</p>
            <span className="value">
              {nextCourseInfo.numberOfStudents}
              {' / '}
              {totalStudents}
            </span>
          </div>
          <div className="separator mx-4" />
          <div className="d-flex flex-column align-items-center">
            <p className="title">Classes</p>
            <span className="value">{classes.count}</span>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end align-items-center my-3">
        <Button
          as="a"
          href={courseDetailsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none button-course-details mr-3"
        >
          <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
          Course details
        </Button>
        <Button onClick={openModal}>
          Add Class
        </Button>
        <AddClass
          isOpen={isOpenModal}
          onClose={closeModal}
          courseInfo={nextCourseInfo}
        />
      </div>
      <CourseDetailTable count={classes.count} data={classes.data} />
      {classes.numPages > 1 && (
      <Pagination
        paginationLabel="paginationNavigation"
        pageCount={classes.numPages}
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

export default CoursesDetailPage;
