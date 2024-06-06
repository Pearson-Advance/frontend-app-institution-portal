import React from 'react';
import PropTypes from 'prop-types';

import { getInitials } from 'helpers';
import 'features/Classes/InstructorAvatar/index.scss';

const InstructorAvatar = ({ profileImage, name }) => (
  <article className="d-flex align-items-center mr-3 my-3 my-lg-1" title={name}>{
    profileImage ? (
      <img
        src={profileImage}
        alt="Instructor profile"
        className="instructor-image"
      />
    ) : <span className="instructor-image">{getInitials(name)}</span>
  }
    <span className="text-capitalize ml-3 multiline-text text-black text-truncate d-block">
      {name.split(' ').join('\n')}
    </span>
  </article>
);

InstructorAvatar.propTypes = {
  profileImage: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default InstructorAvatar;
