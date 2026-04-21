import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import {
  Container,
  Pagination,
  useToggle,
  Form,
  Col,
} from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import AddClass from 'features/Courses/AddClass';
import LinkWithQuery from 'features/Main/LinkWithQuery';
import CourseDetailTable from 'features/Courses/CourseDetailTable';

import { fetchClassesData } from 'features/Classes/data/thunks';
import { fetchInstructorsOptionsData } from 'features/Instructors/data';
import { fetchCoursesOptionsData } from 'features/Courses/data/thunks';
import { fetchClassesDataSuccess, updateCurrentPage as updateClassesCurrentPage } from 'features/Classes/data/slice';
import { fetchCoursesDataSuccess, updateCurrentPage } from 'features/Courses/data/slice';

import { initialPage } from 'features/constants';
import { useInstitutionIdQueryParam } from 'hooks';

import 'features/Courses/CoursesDetailPage/index.scss';

const CoursesDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { courseId } = useParams();

  const courseIdDecoded = decodeURIComponent(courseId);
  const addQueryParam = useInstitutionIdQueryParam();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isOpenModal, openModal, closeModal] = useToggle(false);
  const [classFilter, setClassFilter] = useState('');

  const defaultCourseInfo = useMemo(() => ({
    numberOfStudents: '-',
    numberOfPendingStudents: '-',
    masterCourseId: '-',
  }), []);
  const institution = useSelector((state) => state.main.selectedInstitution);
  const courseInfo = useSelector((state) => state.courses.selectOptions)
    .find((course) => course?.masterCourseId === courseIdDecoded) || defaultCourseInfo;

  const classes = useSelector((state) => state.classes.table);
  const totalStudents = courseInfo.numberOfStudents + courseInfo.numberOfPendingStudents;
  const courseDetailsLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${courseInfo.masterCourseId}/home`;

  const isButtonDisabled = classFilter.trim().length < 2;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const handleResetFilter = () => {
    setCurrentPage(initialPage);
    dispatch(updateCurrentPage(initialPage));
    dispatch(fetchClassesData(institution.id, initialPage, courseIdDecoded));
    setClassFilter('');
  };

  const handleFilter = async (e) => {
    e.preventDefault();

    if (isButtonDisabled) {
      return;
    }
    const form = e.target;
    const formData = new FormData(form);
    formData.append('class_name', classFilter);
    const formJson = Object.fromEntries(formData.entries());

    try {
      dispatch(fetchClassesData(institution.id, initialPage, courseIdDecoded, formJson));
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    const initialState = {
      results: [],
      count: 0,
      numPages: 0,
    };

    if (institution.id) {
      dispatch(fetchClassesData(institution.id, initialPage, courseIdDecoded));
      dispatch(fetchInstructorsOptionsData(institution.id, initialPage, { limit: false }));
      dispatch(fetchCoursesOptionsData(institution.id));
    }

    return () => {
      dispatch(fetchCoursesDataSuccess(initialState));
      dispatch(fetchClassesDataSuccess(initialState));
    };
  }, [dispatch, institution.id, courseIdDecoded]);

  useEffect(() => {
    if (institution.id) {
      const filters = classFilter.trim() ? { class_name: classFilter } : {};
      dispatch(fetchClassesData(institution.id, currentPage, courseIdDecoded, filters));
    }
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (institution.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution.id !== institutionRef.current) {
      history.push(addQueryParam('/courses'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, history]);

  const finalCall = () => {
    dispatch(fetchClassesData(institution.id, initialPage, courseIdDecoded));
    dispatch(updateClassesCurrentPage(initialPage));
  };

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <LinkWithQuery to="/courses" className="mr-3 link">
            <i className="fa-solid fa-arrow-left" />
          </LinkWithQuery>
          <h3 className="h2 mb-0 course-title">{courseInfo.masterCourseName}</h3>
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
          Course content
        </Button>
        <Button onClick={openModal}>
          Add Class
        </Button>
        <AddClass
          isOpen={isOpenModal}
          onClose={closeModal}
          courseInfo={courseInfo}
          finalCall={finalCall}
        />
      </div>
      <div className="page-content-container px-2">
        <Form onSubmit={handleFilter} className="mb-5 mt-3">
          <Form.Row className="d-flex flex-wrap w-100 mr-0 px-2">
            <Form.Group as={Col} className="mr-0 w-100 px-0">
              <Form.Control
                className="w-100 mr-0"
                type="text"
                floatingLabel="Class name"
                name="class_name"
                data-testid="class_name"
                onChange={(e) => setClassFilter(e.target.value)}
                value={classFilter}
              />
            </Form.Group>
          </Form.Row>
          <Form.Group className="w-100 d-flex justify-content-end px-3">
            <Button
              onClick={handleResetFilter}
              variant="tertiary"
              text
              className="mr-2"
              disabled={isButtonDisabled}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isButtonDisabled}>Apply</Button>
          </Form.Group>
        </Form>
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
      </div>
    </Container>
  );
};

export default CoursesDetailPage;
