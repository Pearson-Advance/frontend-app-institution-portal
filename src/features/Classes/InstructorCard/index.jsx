import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { formatDateRange } from 'helpers';
import { initialPage, RequestStatus } from 'features/constants';
import { resetInstructorOptions } from 'features/Instructors/data/slice';
import { fetchInstructorsOptionsData } from 'features/Instructors/data/thunks';

import InstructorAvatar from 'features/Classes/InstructorAvatar';
import { Spinner } from '@edx/paragon';

import 'features/Classes/InstructorCard/index.scss';

const INSTRUCTORS_NUMBER = 3;

const InstructorCard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { courseId, classId } = useParams();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const instructors = useSelector((state) => state.instructors.selectOptions.data);
  const classes = useSelector((state) => state.classes.allClasses);

  const queryParams = new URLSearchParams(location.search);
  const classIdQuery = queryParams.get('classId')?.replaceAll(' ', '+');

  const isLoadingClasses = classes.status === RequestStatus.LOADING;

  const [classInfo] = classes.data.filter(
    (classElement) => classElement.classId === classIdQuery,
  );

  const totalEnrolled = (classInfo?.numberOfStudents || 0)
    + (classInfo?.numberOfPendingStudents || 0);

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchInstructorsOptionsData(institution.id, initialPage, { limit: false, class_id: classIdQuery }));
    }
    return () => dispatch(resetInstructorOptions());
  }, [institution.id, classIdQuery, dispatch]);

  return (
    <article className="instructor-wrapper mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start">
      <div className="d-flex flex-column w-75 justify-content-between h-100">
        <h3 className="text-color text-uppercase font-weight-bold text-truncate w-75" title={classId}>
          {decodeURIComponent(classId)}
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
            <h4 className="text-color text-uppercase font-weight-bold text-truncate w-75" title={courseId}>
              {courseId}
            </h4>
            <div className="text-uppercase">
              <i className="fa-regular fa-calendar mr-2" />
              <span>
                {formatDateRange(classInfo?.startDate, classInfo?.endDate)}
              </span>
            </div>
            <div className="text-color">
              <b className="mr-1">Enrollment:</b>
              {classInfo?.minStudentsAllowed && (
                <>minimum {classInfo.minStudentsAllowed}, </>
              )}
              enrolled {totalEnrolled}, maximum {classInfo?.maxStudents}
            </div>
          </>
        )}
      </div>
      <div className="separator" />
      <div className="instructor-details">
        <h4 className="text-color text-uppercase mb-3 h5">Instructor{instructors.length > 1 && 's'}</h4>
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
            {classInfo?.instructors.length === 0 && <span>No instructor assigned</span>}
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
      </div>
    </article>
  );
};

export default InstructorCard;
