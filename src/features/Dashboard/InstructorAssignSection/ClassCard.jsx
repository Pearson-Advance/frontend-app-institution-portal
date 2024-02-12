import React from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { Button } from 'react-paragon-topaz';
import { useToggle } from '@edx/paragon';
import AssignInstructors from 'features/Instructors/AssignInstructors';

import { updateClassSelected } from 'features/Instructors/data/slice';

import 'features/Dashboard/InstructorAssignSection/index.scss';

const ClassCard = ({ data }) => {
  const dispatch = useDispatch();
  const [isOpen, open, close] = useToggle(false);
  const fullDate = format(new Date(data.startDate), 'PP');

  const handleAssignModal = () => {
    dispatch(updateClassSelected(data.classId)); // eslint-disable-line react/prop-types
    open();
  };

  return (
    <>
      <AssignInstructors
        isOpen={isOpen}
        close={close}
      />
      <div className="class-card-container">
        <h4>{data?.className}</h4>
        <p className="course-name">{data?.masterCourseName}</p>
        <p className="date"><i className="fa-sharp fa-regular fa-calendar-day" />{fullDate}</p>
        <Button variant="outline-primary" size="sm" onClick={handleAssignModal}>
          <i className="fa-regular fa-chalkboard-user" />
          Assign instructor
        </Button>
      </div>
    </>

  );
};

ClassCard.propTypes = {
  data: PropTypes.shape({
    className: PropTypes.string,
    masterCourseName: PropTypes.string,
    startDate: PropTypes.string,
  }),
};

ClassCard.defaultProps = {
  data: {},
};

export default ClassCard;
