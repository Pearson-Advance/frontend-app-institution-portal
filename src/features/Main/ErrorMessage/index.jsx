import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => (
  <div className="d-flex justify-content-center align-items-center">
    <h3 className="text-danger">{message}</h3>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

ErrorMessage.defaultProps = {
  message: 'An error occurred, please try again later.',
};

export default ErrorMessage;
