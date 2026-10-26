import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, useToggle } from '@openedx/paragon';
import { Button } from 'react-paragon-topaz';

import LinkWithQuery from 'features/Main/LinkWithQuery';
import AddSessionModal from 'features/Sessions/AddSessionModal';
import EnrollStudentModal from 'features/Sessions/EnrollStudentModal';
import SessionDetailTable from 'features/Sessions/SessionDetailTable';

import { useGetSessionDetailQuery } from 'features/Sessions/data/sessionsApi';
import { useInstitutionIdQueryParam } from 'hooks';

import { formatUTCDate } from 'helpers';

const SessionDetailPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const sessionIdDecoded = decodeURIComponent(sessionId);
  const addQueryParam = useInstitutionIdQueryParam();
  const institutionRef = useRef(undefined);

  const [isOpenEditSessionModal, openEditSessionModal, closeEditSessionModal] = useToggle(false);
  const [isOpenEnrollModal, openEnrollModal, closeEnrollModal] = useToggle(false);

  const institution = useSelector((state) => state.main.selectedInstitution);
  const {
    data: sessionInfo = {
      sessionId: '',
      sessionName: '-',
      programTitle: '-',
      numberOfStudents: 0,
      totalClasses: 0,
      classes: [],
      startDate: null,
      endDate: null,
    },
    isLoading: isLoadingSession,
  } = useGetSessionDetailQuery(
    { sessionId: sessionIdDecoded, institutionId: institution?.id },
    { skip: !institution?.id || !sessionIdDecoded },
  );

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
          <div>
            <h3 className="h2 mb-0 session-title">Session: {sessionInfo.sessionName}</h3>
            <span className="text-muted small">Program: {sessionInfo.programTitle}</span>
            <p>
              {sessionInfo.startDate && (
              <span className="text-muted small">
                Start Date: {formatUTCDate(sessionInfo.startDate)}
              </span>
              )}
              {sessionInfo.endDate && (
              <span className="text-muted small ml-2">
                End Date: {formatUTCDate(sessionInfo.endDate)}
              </span>
              )}
            </p>
          </div>
        </div>

        <div className="card-container d-flex justify-content-around align-items-center">
          <div className="d-flex flex-column align-items-center">
            <p className="title">Students enrolled</p>
            <span className="value">{sessionInfo.numberOfStudents}</span>
          </div>
          <div className="separator mx-4" />
          <div className="d-flex flex-column align-items-center">
            <p className="title">Number of classes</p>
            <span className="value">{sessionInfo.totalClasses || sessionInfo.classes?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end align-items-center my-3">
        <Button onClick={openEnrollModal} variant="outline-primary" className="mr-3 btn-outline-primary">
          Enroll student
        </Button>
        <Button
          onClick={openEditSessionModal}
        >
          Edit session
        </Button>

        <AddSessionModal
          isOpen={isOpenEditSessionModal}
          onClose={closeEditSessionModal}
          sessionData={sessionInfo}
          isEditing
        />
        <EnrollStudentModal
          isOpen={isOpenEnrollModal}
          onClose={closeEnrollModal}
          sessionId={sessionIdDecoded}
          sessionName={sessionInfo.sessionName}
        />
      </div>

      <div className="page-content-container px-2">
        <SessionDetailTable
          isLoading={isLoadingSession}
          count={sessionInfo.classes?.length || 0}
          data={sessionInfo.classes || []}
        />
      </div>
    </Container>
  );
};

export default SessionDetailPage;
