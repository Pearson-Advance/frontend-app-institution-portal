import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@openedx/paragon';
import { Button } from 'react-paragon-topaz';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { formatDateRange } from 'helpers';
import { useInstitutionIdQueryParam } from 'hooks';
import { useGetClassesByCourseQuery } from 'features/Classes/data/classesApi';
import { useGetInstructorsOptionsQuery } from 'features/Instructors/data/instructorsApi';

import InstructorAvatar from 'features/Classes/InstructorAvatar';

import 'features/Classes/InstructorCard/index.scss';

const INSTRUCTORS_NUMBER = 3;

const normalizeName = (value) => (value || '').trim().toLowerCase();

const InstructorCard = ({ previousPage, children }) => {
  const { classId, courseId } = useParams();
  const navigate = useNavigate();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const classIdDecoded = decodeURIComponent(classId);

  const addQueryParam = useInstitutionIdQueryParam();

  const handleManageInstructorButton = () => {
    navigate(addQueryParam(`/manage-instructors/${courseId}/${classId}?previous=${previousPage}`));
  };

  const { data: classesData = [], isFetching: isLoadingClasses } = useGetClassesByCourseQuery(
    { institutionId: institution.id, courseId: decodeURIComponent(courseId) },
    { skip: !institution.id },
  );

  const { data: instructors = [] } = useGetInstructorsOptionsQuery(
    { institutionId: institution.id, filters: { limit: false, class_id: classIdDecoded } },
    { skip: !institution.id },
  );

  const [classInfo] = classesData.filter(
    (classElement) => classElement.classId === classIdDecoded,
  );

  const {
    purchasedSeats,
    numberOfStudents,
    numberOfPendingStudents,
    maxStudents,
    totalEnrollments,
    totalPendingEnrollments,
  } = classInfo || {};

  const totalEnrolled = (numberOfStudents || 0)
    + (numberOfPendingStudents || 0);

  const seatsAvailable = maxStudents > 0
    ? Math.max(0, maxStudents - totalEnrolled)
    : 'no max';

  const remainingLicenses = Math.max(
    0,
    (purchasedSeats || 0) - (totalEnrollments || 0) - (totalPendingEnrollments || 0),
  );

  return (
    <article className="instructor-wrapper mb-4">
      <div className="instructor-wrapper__main">
        <section className="instructor-wrapper__class-info">
          {isLoadingClasses && (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          )}

          {!isLoadingClasses && (
            <>
              <h3
                className="instructor-wrapper__class-name text-color text-uppercase font-weight-bold text-truncate"
                title={classInfo?.className}
              >
                {classInfo?.className}
              </h3>

              <h4
                className="instructor-wrapper__course-name text-color text-uppercase font-weight-bold text-truncate"
                title={classInfo?.masterCourseName}
              >
                {classInfo?.masterCourseName}
              </h4>

              <div className="instructor-wrapper__date text-uppercase">
                <i className="fa-regular fa-calendar mr-2" />
                <span>
                  {formatDateRange(classInfo?.startDate, classInfo?.endDate)}
                </span>
              </div>

              <div className="instructor-wrapper__enrollment text-color">
                <b className="mr-1">Enrollment:</b>
                {totalEnrolled} enrolled, {seatsAvailable} {seatsAvailable > 0 && 'seat'}{seatsAvailable > 1 && 's'} {seatsAvailable > 0 && 'available'}, {remainingLicenses} license{remainingLicenses > 1 && 's'} remaining
              </div>
            </>
          )}
        </section>

        <div className="separator" />

        <section className="instructor-details">
          <h4 className="text-color text-uppercase mb-3 h5">
            Instructor{instructors?.length > 1 && 's'}
          </h4>

          {isLoadingClasses && (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          )}

          {!isLoadingClasses && (
            <div className="d-flex align-items-center flex-wrap">
              {classInfo?.instructors?.length === 0 && (
                <Button
                  variant="outline-primary"
                  className="text-decoration-none text-primary bg-white p-2 px-3"
                  onClick={handleManageInstructorButton}
                >
                  Assign instructor
                </Button>
              )}

              {classInfo?.instructors?.slice(0, INSTRUCTORS_NUMBER)?.map((instructor, index) => {
                const instructorInfo = instructors.find(
                  (user) => normalizeName(user.instructorName) === normalizeName(instructor)
                    || normalizeName(user.instructorUsername) === normalizeName(instructor),
                );

                return (
                  <InstructorAvatar
                    key={instructorInfo?.instructorUsername || `${instructor}-${index}`}
                    profileImage={instructorInfo?.instructorImage || ''}
                    name={instructorInfo?.instructorName || instructor || ''}
                  />
                );
              })}
            </div>
          )}

          {classInfo?.instructors?.length > INSTRUCTORS_NUMBER && (
            <div className="mt-2">
              +
              <span className="mx-1">{classInfo.instructors.slice(INSTRUCTORS_NUMBER).length}</span>
              more...
            </div>
          )}

          {classInfo?.instructors?.length > 0 && (
            <Button
              variant="tertiary"
              className="text-decoration-underline text-primary bg-white p-2 px-0"
              onClick={handleManageInstructorButton}
            >
              Manage instructor{instructors?.length > 1 && 's'}
            </Button>
          )}
        </section>
      </div>

      {children && (
        <div className="instructor-wrapper__overview">
          {children}
        </div>
      )}
    </article>
  );
};

InstructorCard.propTypes = {
  children: PropTypes.node,
  previousPage: PropTypes.string,
};

InstructorCard.defaultProps = {
  children: null,
  previousPage: 'courses',
};

export default InstructorCard;
