import React, { useState, useEffect, useRef } from 'react';
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
  const { courseId } = useParams();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isOpenModal, openModal, closeModal] = useToggle(false);

  const defaultCourseInfo = {
    numberOfStudents: '-',
    numberOfPendingStudents: '-',
    masterCourseId: '-',
    masterCourseName: '-',
  };

  const courseInfo = useSelector((state) => state.courses.table.data)
    .find((course) => course?.masterCourseId === courseId) || defaultCourseInfo;
  const institution = useSelector((state) => state.main.selectedInstitution);
  const classes = useSelector((state) => state.classes.table);
  const totalStudents = courseInfo.numberOfStudents + courseInfo.numberOfPendingStudents;
  const courseDetailsLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${courseInfo.masterCourseId}/home`;
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
      dispatch(fetchClassesData(institution.id, initialPage, courseInfo.masterCourseName));
      dispatch(fetchCoursesData(institution.id, initialPage, null));
    }

    return () => {
      dispatch(fetchCoursesDataSuccess(initialState));
      dispatch(fetchClassesDataSuccess(initialState));
    };
  }, [dispatch, institution.id, courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchClassesData(institution.id, currentPage, courseInfo.masterCourseName));
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
          <h3 className="h2 mb-0 course-title">{courseId}</h3>
        </div>

        <div className="card-container d-flex justify-content-around align-items-center">
          <div className="d-flex flex-column align-items-center">
            <p className="title">Students enrolled</p>
            <span className="value">
              {courseInfo.numberOfStudents}
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
          courseInfo={courseInfo}
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
