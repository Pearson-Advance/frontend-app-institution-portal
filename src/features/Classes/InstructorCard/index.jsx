import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { formatDateRange } from 'helpers';
import { initialPage } from 'features/constants';
import { updateInstructorOptions } from 'features/Instructors/data/slice';
import { fetchInstructorsOptionsData } from 'features/Instructors/data/thunks';

import instructorDefaultImage from 'assets/avatar.svg';

import 'features/Classes/InstructorCard/index.scss';

const InstructorCard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { courseId, classId } = useParams();
  const institution = useSelector((state) => state.main.selectedInstitution);
  const instructors = useSelector((state) => state.instructors.selectOptions);
  const classes = useSelector((state) => state.classes.allClasses.data);

  const queryParams = new URLSearchParams(location.search);
  const classIdQuery = queryParams.get('classId')?.replaceAll(' ', '+');

  const [classInfo] = classes.filter(
    (classElement) => classElement.classId === classIdQuery,
  );

  const totalEnrolled = (classInfo?.numberOfStudents || 0)
    + (classInfo?.numberOfPendingStudents || 0);

  const extraInstructors = classInfo?.instructors?.length === 1
    ? (classInfo?.instructors?.length || 0)
    : (classInfo?.instructors?.length || 0) - 1;

  useEffect(() => {
    if (institution.id) {
      dispatch(fetchInstructorsOptionsData(institution.id, initialPage, { limit: false, class_id: classIdQuery }));
    }
    return () => dispatch(updateInstructorOptions([]));
  }, [institution.id, classIdQuery, dispatch]);

  return (
    <article className="instructor-wrapper page-content-container mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start">
      <div className="d-flex flex-column w-75 justify-content-between h-100">
        <h3 className="text-color text-uppercase font-weight-bold text-truncate w-75" title={classId}>
          {classId}
        </h3>
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
      </div>
      <div className="separator" />
      <div className="instructor-details">
        <h4 className="text-color text-uppercase mb-3 h5">Instructor</h4>
        <div className="d-flex align-items-center">
          <img
            src={instructors[0]?.instructorImage ? instructors[0]?.instructorImage : instructorDefaultImage}
            alt="Instructor profile"
            className="instructor-image"
          />
          <span className="text-capitalize ml-3 text-black font-weight-bold text-truncate w-50 d-block" title={classInfo?.instructors[0]}>
            {classInfo?.instructors[0]}
          </span>
        </div>
        {classInfo?.instructors?.length > 1 && (
          <div className="mt-2">
            +
            <span className="mx-1">{extraInstructors}</span>
            more...
          </div>
        )}
      </div>
    </article>
  );
};

export default InstructorCard;
