import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { formatDateRange } from 'helpers';
import { useInstitutionIdQueryParam } from 'hooks';
import { initialPage, RequestStatus } from 'features/constants';
import { resetInstructorOptions } from 'features/Instructors/data/slice';
import { fetchInstructorsOptionsData } from 'features/Instructors/data/thunks';

import InstructorAvatar from 'features/Classes/InstructorAvatar';

import 'features/Classes/InstructorCard/index.scss';

const INSTRUCTORS_NUMBER = 3;

const InstructorCard = ({ previousPage }) => {
  const dispatch = useDispatch();
  const { classId, courseId } = useParams();
  const history = useHistory();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const instructors = useSelector((state) => state.instructors.selectOptions.data);
  const classes = useSelector((state) => state.classes.allClasses);
  const classIdDecoded = decodeURIComponent(classId);

  const addQueryParam = useInstitutionIdQueryParam();

  const handleManageInstructorButton = () => {
    history.push(addQueryParam(`/manage-instructors/${courseId}/${classId}?previous=${previousPage}`));
  };

  const isLoadingClasses = classes.status === RequestStatus.LOADING;

  const [classInfo] = classes.data.filter(
    (classElement) => classElement.classId === classIdDecoded,
  );

  const { purchasedSeats, numberOfStudents, numberOfPendingStudents } = classInfo || {};

  const totalEnrolled = (numberOfStudents || 0)
    + (numberOfPendingStudents || 0);

  const remainingSeats = (purchasedSeats - numberOfStudents - numberOfPendingStudents) || 0;

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchInstructorsOptionsData(institution.id, initialPage, { limit: false, class_id: classIdDecoded }));
    }
    return () => dispatch(resetInstructorOptions());
  }, [institution.id, classIdDecoded, dispatch]);

  return (
    <article className="instructor-wrapper mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start">
      <div className="d-flex flex-column w-75 justify-content-between h-100">
        <h3 className="text-color text-uppercase font-weight-bold text-truncate w-75" title={classInfo?.className}>
          {classInfo?.className}
        </h3>
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
            <h4 className="text-color text-uppercase font-weight-bold text-truncate w-75" title={classInfo?.masterCourseName}>
              {classInfo?.masterCourseName}
            </h4>
            <div className="text-uppercase">
              <i className="fa-regular fa-calendar mr-2" />
              <span>
                {formatDateRange(classInfo?.startDate, classInfo?.endDate)}
              </span>
            </div>
            <div className="text-color">
              <b className="mr-1">Enrollment:</b>
              {totalEnrolled} enrolled, {remainingSeats} seat{remainingSeats > 1 && 's'} remaining
            </div>
          </>
        )}
      </div>
      <div className="separator" />
      <div className="instructor-details">
        <h4 className="text-color text-uppercase mb-3 h5">Instructor{instructors?.length > 1 && 's'}</h4>
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

            {
              classInfo?.instructors?.slice(0, INSTRUCTORS_NUMBER)?.map((instructor) => {
                const instructorInfo = instructors.find((user) => user.instructorUsername === instructor);

                if (!instructorInfo) { return null; }

                return (
                  <InstructorAvatar
                    key={instructorInfo.instructorUsername}
                    profileImage={instructorInfo.instructorImage}
                    name={instructorInfo.instructorName}
                  />
                );
              })
            }
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
      </div>
    </article>
  );
};

InstructorCard.propTypes = {
  previousPage: PropTypes.string,
};

InstructorCard.defaultProps = {
  previousPage: 'courses',
};

export default InstructorCard;
