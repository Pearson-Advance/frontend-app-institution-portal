import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Button } from 'react-paragon-topaz';
import { Tooltip, OverlayTrigger } from '@edx/paragon';

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
      <OverlayTrigger
        placement="top"
        overlay={
          (
            <Tooltip>
              {data?.className}
            </Tooltip>
          )
        }
      >
        <h4 className="truncated-text">{data?.className}</h4>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        overlay={
          (
            <Tooltip>
              {data?.masterCourseName}
            </Tooltip>
          )
        }
      >
        <p className="course-name truncated-text">{data?.masterCourseName}</p>
      </OverlayTrigger>
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
