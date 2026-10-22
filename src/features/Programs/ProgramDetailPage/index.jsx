import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Pagination,
  useToggle,
} from '@openedx/paragon';
import { Button } from 'react-paragon-topaz';

import LinkWithQuery from 'features/Main/LinkWithQuery';
import AddSessionModal from 'features/Sessions/AddSessionModal';
import ProgramDetailTable from 'features/Programs/ProgramDetailTable';

import { useGetProgramDetailQuery } from 'features/Programs/data/programsApi';
import { useGetSessionsByOfferingQuery } from 'features/Sessions/data/sessionsApi';
import { initialPage } from 'features/constants';
import { useInstitutionIdQueryParam } from 'hooks';

import './index.scss';

const ProgramDetailPage = () => {
  const navigate = useNavigate();
  const { programId } = useParams();

  const programIdDecoded = decodeURIComponent(programId);
  const addQueryParam = useInstitutionIdQueryParam();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isOpenAddModal, openAddModal, closeAddModal] = useToggle(false);

  const institution = useSelector((state) => state.main.selectedInstitution);

  const { data: programInfo = { programTitle: '-', numberOfStudents: 0, totalSessions: 0 } } = useGetProgramDetailQuery(
    { programId: programIdDecoded, institutionId: institution?.id },
    { skip: !institution?.id || !programIdDecoded },
  );

  const {
    data: sessionsResponse = { results: [], count: 0, numPages: 0 },
    isLoading: isLoadingSessions,
  } = useGetSessionsByOfferingQuery(
    {
      institutionId: institution?.id,
      offeringId: programIdDecoded,
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
            <p className="title">Students enrolled</p>
            <span className="value">{programInfo.numberOfStudents}</span>
          </div>
          <div className="separator mx-4" />
          <div className="d-flex flex-column align-items-center">
            <p className="title">Sessions</p>
            <span className="value">{programInfo.totalSessions}</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end align-items-center my-3">
        <Button
          as="a"
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none btn-view-courses mr-3"
          variant="outline-primary"
        >
          View courses
        </Button>
        <Button onClick={openAddModal}>Add session</Button>
        <AddSessionModal
          isOpen={isOpenAddModal}
          onClose={closeAddModal}
          programInfo={{ ...programInfo, programId: programIdDecoded }}
        />
      </div>

      <div className="page-content-container px-2">
        <ProgramDetailTable
          isLoading={isLoadingSessions}
          count={sessionsResponse.count}
          data={sessionsResponse.results}
        />
        {sessionsResponse.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={sessionsResponse.numPages}
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

export default ProgramDetailPage;
