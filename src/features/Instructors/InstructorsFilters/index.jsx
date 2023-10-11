import React, { useState } from 'react';
import {
  DropdownButton, Form, Col, Button,
} from '@edx/paragon';
import PropTypes from 'prop-types';

const initialFilterFormValues = {
  instructorName: '',
  instructorEmail: '',
  ccxId: '',
};

const InstructorsFilters = ({ fetchData, resetPagination }) => {
  const [filters, setFilters] = useState(initialFilterFormValues);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleApplyFilters = async () => {
    fetchData(filters);
  };

  const handleCleanFilters = () => {
    setFilters(initialFilterFormValues);
    fetchData();
    resetPagination();
  };

  return (
    <DropdownButton title="Filters" variant="outline-primary">
      <Form className="row justify-content-center px-3 py-2">
        <Form.Group as={Col} className="mb-0">
          <Form.Control
            type="text"
            floatingLabel="Name"
            name="instructorName"
            placeholder="Enter Instructor Name"
            value={filters.instructorName}
            onChange={handleInputChange}
            className="mb-3 mr-0"
          />
          <Form.Control
            type="text"
            floatingLabel="Email"
            name="instructorEmail"
            placeholder="Enter Instructor Email"
            value={filters.instructorEmail}
            onChange={handleInputChange}
            className="mb-3 mr-0"
          />
          <Form.Control
            type="text"
            floatingLabel="Class Name"
            name="ccxId"
            placeholder="Enter Class Name"
            value={filters.ccxId}
            onChange={handleInputChange}
            className="mb-4 mr-0"
          />
          <div className="d-flex justify-content-between">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button onClick={handleCleanFilters} variant="outline-primary">Clear</Button>
          </div>
        </Form.Group>
      </Form>
    </DropdownButton>
  );
};

InstructorsFilters.propTypes = {
  fetchData: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
};

export default InstructorsFilters;
