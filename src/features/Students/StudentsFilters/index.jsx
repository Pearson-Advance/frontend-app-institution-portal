import { Col, Form } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

export const StudentsFilters = props => {
  const {
    filters,
    setFilters,
  } = props;

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value.trim(),
    });
  };

  return (
    <Form className="row justify-content-center">
      <Form.Group as={Col}>
        <Form.Control
          type="text"
          floatingLabel="Name"
          name="learner_name"
          placeholder="Enter Student Name"
          value={filters.learner_name}
          onChange={handleInputChange}
          className="mb-3"
        />
        <Form.Control
          type="email"
          floatingLabel="Email"
          name="learner_email"
          placeholder="Enter Student Email"
          value={filters.learner_email}
          onChange={handleInputChange}
          className="mb-3"
        />
        <Form.Control
          type="text"
          floatingLabel="Instructor"
          name="instructor"
          placeholder="Enter Instructor"
          value={filters.instructor}
          onChange={handleInputChange}
          className="mb-3"
        />
        <Form.Control
          type="text"
          floatingLabel="Class Name"
          name="ccx_name"
          placeholder="Enter Class Name"
          value={filters.ccx_name}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Form>
  );
};

StudentsFilters.propTypes = {
  filters: PropTypes.shape({
    learner_name: PropTypes.string,
    learner_email: PropTypes.string,
    instructor: PropTypes.string,
    ccx_name: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};
