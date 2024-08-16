import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Button } from 'react-paragon-topaz';

import { formatDateRange } from 'helpers';
import { useInstitutionIdQueryParam } from 'hooks';

import 'features/Dashboard/InstructorAssignSection/index.scss';

const ClassCard = ({ data }) => {
  const history = useHistory();
  const addQueryParam = useInstitutionIdQueryParam();

  const handleManageButton = () => {
    history.push(addQueryParam(`/manage-instructors/${encodeURIComponent(data?.masterCourseId)}/${encodeURIComponent(data?.classId)}?previous=dashboard`));
  };

  return (
    <div className="class-card-container">
      <h4>{data?.className}</h4>
      <p className="course-name">{data?.masterCourseName}</p>
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
