import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Pagination,
  useToggle,
} from '@openedx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import LinkWithQuery from 'features/Main/LinkWithQuery';
import AddSessionModal from 'features/Sessions/AddSessionModal';
import ProgramDetailTable from 'features/Programs/ProgramDetailTable';

import { useGetProgramDetailQuery } from 'features/Programs/data/programsApi';
import {
  useGetSessionsByOfferingQuery,
  useAddSessionMutation,
} from 'features/Sessions/data/sessionsApi';
import { initialPage } from 'features/constants';
import { useInstitutionIdQueryParam } from 'hooks';
import { formatUTCDate, buildFilterParams } from 'helpers';

const ProgramDetailPage = () => {
  const navigate = useNavigate();
  const { programId } = useParams();

  const programIdDecoded = decodeURIComponent(programId);
  const addQueryParam = useInstitutionIdQueryParam();

  const institutionRef = useRef(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isOpenAddModal, openAddModal, closeAddModal] = useToggle(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const institution = useSelector((state) => state.main.selectedInstitution);

  const {
    data: programInfo = { programTitle: '-', numberOfStudents: 0, totalSessions: 0 },
    refetch: refetchProgramDetail,
  } = useGetProgramDetailQuery(
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

  const [addSession, { isLoading: isCreatingSession }] = useAddSessionMutation();

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
  };

  const handleViewCourses = () => {
    navigate(addQueryParam(`/programs/${encodeURIComponent(programIdDecoded)}/courses`));
  };

  const getApiErrorMessage = (error) => {
    const errorData = error?.data;

    if (errorData && typeof errorData === 'object') {
      if (errorData.detail) { return errorData.detail; }
      if (errorData.message) { return errorData.message; }
      if (Array.isArray(errorData.non_field_errors)) {
        return errorData.non_field_errors.join(' ');
      }

      const fieldErrors = Object.entries(errorData)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .join('\n');

      if (fieldErrors) { return fieldErrors; }
    }

    return 'An unexpected error occurred while creating the session.';
  };

  const handleCreateSession = async (formData) => {
    const licenseId = programInfo.licenseId ?? programInfo.license?.id;

    const body = buildFilterParams({
      offering_id: Number(programIdDecoded),
      institution_id: institution?.id,
      license_id: Number(licenseId),
      name: formData.sessionName.trim(),
      start_date: formatUTCDate(formData.startDate, "yyyy-MM-dd'T'00:00:00'Z'"),
    });

    try {
      const result = await addSession(body).unwrap();

      if (result?.status === 'creation_failed') {
        setToastMessage('Session created with issues. Some course classes failed to initialize.');
      } else {
        setToastMessage('Session created successfully.');
      }

      setShowToast(true);
      refetchProgramDetail();
      return closeAddModal();
    } catch (error) {
      logError(error);
      setToastMessage(getApiErrorMessage(error));
      setShowToast(true);
      return closeAddModal();
    }
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
          className="text-decoration-none btn-outline-primary mr-3"
          variant="outline-primary"
          onClick={handleViewCourses}
        >
          View courses
        </Button>
        <Button onClick={openAddModal}>Add session</Button>
        <AddSessionModal
          isOpen={isOpenAddModal}
          onClose={closeAddModal}
          onSubmit={handleCreateSession}
          isLoading={isCreatingSession}
          showToast={showToast}
          setShowToast={setShowToast}
          toastMessage={toastMessage}
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
