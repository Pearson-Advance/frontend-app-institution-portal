import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Button } from 'react-paragon-topaz';

import { formatDateRange } from 'helpers';
import { useInstitutionIdQueryParam } from 'hooks';

import EllipsisText from 'features/Dashboard/InstructorAssignSection/EllipsisText';
import { textLength } from 'features/constants';

import 'features/Dashboard/InstructorAssignSection/index.scss';

const ClassCard = ({ data }) => {
  const history = useHistory();
  const addQueryParam = useInstitutionIdQueryParam();

  const handleManageButton = () => {
    history.push(addQueryParam(`/manage-instructors/${encodeURIComponent(data?.masterCourseId)}/${encodeURIComponent(data?.classId)}?previous=dashboard`));
  };

  return (
    <div className="class-card-container">
      <div className="no-responsive">
        {data?.className.length > textLength ? (
          <EllipsisText title={data?.className} type="className" />
        ) : (
          <h4>{data?.className}</h4>
        )}
        {data?.masterCourseName.length > textLength ? (
          <EllipsisText title={data?.masterCourseName} type="courseName" />
        ) : (
          <p className="course-name">{data?.masterCourseName}</p>
        )}
      </div>
      <div className="responsive">
        <h4>{data?.className}</h4>
        <p className="course-name">{data?.masterCourseName}</p>
      </div>

      <p className="date"><i className="fa-sharp fa-regular fa-calendar-day" />{formatDateRange(data.startDate, data?.endDate)}</p>
      <Button variant="outline-primary" size="sm" onClick={handleManageButton}>
        <i className="fa-regular fa-chalkboard-user" />
        Manage instructor
      </Button>
    </div>
  );
};

ClassCard.propTypes = {
  data: PropTypes.shape({
    classId: PropTypes.string,
    className: PropTypes.string,
    masterCourseName: PropTypes.string,
    masterCourseId: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};

ClassCard.defaultProps = {
  data: {},
};

export default ClassCard;
