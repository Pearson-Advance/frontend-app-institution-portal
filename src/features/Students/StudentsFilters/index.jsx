import {
  Card, Col, Form, Button, OverlayTrigger, Tooltip,
} from '@edx/paragon';
import React from 'react';


export const Filters = props => {
  const {
    filters,
    setFilters,
  } = props;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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
          className='mb-3'
        />
        <Form.Control
          type="email"
          floatingLabel="Email"
          name="learner_email"
          placeholder="Enter Student Email"
          value={filters.learner_email}
          onChange={handleInputChange}
          className='mb-3'
        />
        <Form.Control
          type="text"
          floatingLabel="Instructor"
          name="instructor"
          placeholder="Enter Instructor"
          value={filters.instructor}
          onChange={handleInputChange}
          className='mb-3'
        />
        <Form.Control
          type="text"
          floatingLabel="Class Name"
          name="ccx_name"
          placeholder="Enter Class Name"
          value={filters.ccx_id}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Form>
  )
};
