import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Pagination } from '@openedx/paragon';

import LinkWithQuery from 'features/Main/LinkWithQuery';
import ProgramCoursesTable from 'features/Programs/ProgramCoursesTable';

import {
  useGetProgramDetailQuery,
  useGetCoursesByProgramQuery,
} from 'features/Programs/data/programsApi';
import { initialPage } from 'features/constants';
import { useInstitutionIdQueryParam } from 'hooks';

const ProgramCoursesPage = () => {
  const navigate = useNavigate();
  const { programId } = useParams();

  const programIdDecoded = decodeURIComponent(programId);
  const addQueryParam = useInstitutionIdQueryParam();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const institution = useSelector((state) => state.main.selectedInstitution);

  const {
    data: programInfo = {
      programTitle: '-',
      purchasedSeats: 0,
      consumedSeats: 0,
      enrolledStudents: 0,
      remainingSeats: 0,
    },
  } = useGetProgramDetailQuery(
    { programId: programIdDecoded, institutionId: institution?.id },
    { skip: !institution?.id || !programIdDecoded },
  );

  const {
    data: coursesResponse = { results: [], count: 0, numPages: 0 },
    isLoading: isLoadingCourses,
  } = useGetCoursesByProgramQuery(
    {
      institutionId: institution?.id,
      programId: programIdDecoded,
      page: currentPage,
    },
    { skip: !institution?.id || !programIdDecoded },
  );

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
  };

  useEffect(() => {
    if (institution?.id !== undefined && institutionRef.current === undefined) {
      institutionRef.current = institution.id;
    }

    if (institution?.id !== institutionRef.current) {
      navigate(addQueryParam('/programs'));
    }
  }, [institution, navigate, addQueryParam]);

  return (
    <Container className="px-5 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <LinkWithQuery to="/programs" className="mr-3 link">
            <i className="fa-solid fa-arrow-left" />
          </LinkWithQuery>
          <h3 className="h2 mb-0 program-title">Program: {programInfo.programTitle}</h3>
        </div>

        <div className="card-container d-flex justify-content-around align-items-center">
          <div className="d-flex flex-column align-items-center">
            <p className="title mb-0">Purchased</p>
            <span className="value">{programInfo.purchasedSeats ?? 0}</span>
          </div>
          <div className="separator mx-3" />
          <div className="d-flex flex-column align-items-center">
            <p className="title mb-0">Consumed</p>
            <span className="value">{programInfo.consumedSeats ?? 0}</span>
          </div>
          <div className="separator mx-3" />
          <div className="d-flex flex-column align-items-center">
            <p className="title mb-0">Enrolled</p>
            <span className="value">{programInfo.enrolledStudents ?? 0}</span>
          </div>
          <div className="separator mx-3" />
          <div className="d-flex flex-column align-items-center">
            <p className="title mb-0">Remaining</p>
            <span className="value">{programInfo.remainingSeats ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="page-content-container px-2 mt-4">
        <ProgramCoursesTable
          isLoading={isLoadingCourses}
          count={coursesResponse.count}
          data={coursesResponse.results}
        />
        {coursesResponse.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={coursesResponse.numPages}
            currentPage={currentPage}
            onPageSelect={handlePagination}
            variant="reduced"
            className="mx-auto pagination-table mt-3"
            size="small"
          />
        )}
      </div>
    </Container>
  );
};

export default ProgramCoursesPage;
