import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { Button } from 'react-paragon-topaz';

import 'features/Dashboard/InstructorAssignSection/index.scss';

const ClassCard = ({ data }) => {
  const fullDate = format(new Date(data.startDate), 'PP');

  return (
    <div className="class-card-container">
      <h4>{data?.className}</h4>
      <p className="course-name">{data?.masterCourseName}</p>
      <p className="date"><i className="fa-sharp fa-regular fa-calendar-day" />{fullDate}</p>
      <Button variant="outline-primary" size="sm">
        <i className="fa-regular fa-chalkboard-user" />
        Assign instructor
      </Button>
    </div>
  );
};

ClassCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape([])),
};

ClassCard.defaultProps = {
  data: [],
};

export default ClassCard;
