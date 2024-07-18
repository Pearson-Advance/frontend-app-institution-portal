import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useInstitutionIdQueryParam } from 'hooks';

const LinkWithQuery = ({ children, ...props }) => {
  const addQueryParam = useInstitutionIdQueryParam();
  const link = addQueryParam(props.to);

  return (
    <Link {...props} to={link}>
      {children}
    </Link>
  );
};

LinkWithQuery.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default LinkWithQuery;
