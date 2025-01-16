import React, { useEffect } from 'react';
import {
  Tabs,
  Tab,
  Container,
} from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { ProfileCard, formatUTCDate } from 'react-paragon-topaz';

import ErrorMessage from 'features/Main/ErrorMessage';

import { useInstitutionIdQueryParam } from 'hooks';
import { RequestStatus } from 'features/constants';
import { fetchStudentProfile, resetStudentProfile } from 'features/Students/data';

import 'features/Students/StudentDetailPage/index.scss';

const StudentDetailPage = () => {
  const dispatch = useDispatch();
  const { studentEmail } = useParams();
  const addQueryParam = useInstitutionIdQueryParam();

  const hasError = useSelector((state) => state.students.studentProfile.status) === RequestStatus.ERROR;
  const isLoading = useSelector((state) => state.students.studentProfile.status) === RequestStatus.LOADING;

  const {
    classId,
    courseId,
    className,
    created,
    lastAccess,
    learnerEmail: studentRequestEmail,
    userImageUrl,
    learnerName: studentName = hasError ? 'Error' : 'Loading user...',
  } = useSelector((state) => state.students.studentProfile);

  const originDomain = getConfig().BASE_URL;
  const decodedStudentEmail = decodeURIComponent(studentEmail);
  const studentImage = userImageUrl && userImageUrl.startsWith('/') ? `https://${originDomain}${userImageUrl}` : userImageUrl;

  useEffect(() => {
    dispatch(fetchStudentProfile(decodedStudentEmail));
    return () => {
      dispatch(resetStudentProfile());
    };
  }, [dispatch, decodedStudentEmail]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex align-items-center my-4">
        <h3 className="h2 mb-0 course-title">{studentName}</h3>
      </div>
      <Tabs
        variant="tabs"
        activeKey="profile"
        className="mb-3 nav-tabs"
      >
        <Tab eventKey="profile" title="Profile">
          {hasError ? <ErrorMessage message="Unable to get the student info, please check the email and try again." /> : (
            <ProfileCard
              profileImage={studentImage}
              email={studentRequestEmail}
              userRole="Student"
              name={studentName}
              lastAccessDate={formatUTCDate(lastAccess)}
              isLoading={isLoading}
              createdDate={formatUTCDate(created)}
            >
              <h3 className="text-uppercase">Recent courses taken</h3>
              <Link
                to={addQueryParam(`/courses/${courseId}/${classId}`)}
                className="text-truncate link"
              >
                {className}
              </Link>
            </ProfileCard>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default StudentDetailPage;
