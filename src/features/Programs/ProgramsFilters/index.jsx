import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Col, Form, Icon } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';
import { Button } from 'react-paragon-topaz';

const ProgramsFilters = ({ onApplyFilters }) => {
  const [programName, setProgramName] = useState('');

  const isButtonDisabled = programName.trim() === '';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isButtonDisabled) {
      return;
    }

    onApplyFilters({ name: programName.trim() });
  };

  const handleReset = () => {
    setProgramName('');
    onApplyFilters({});
  };

  return (
    <Form onSubmit={handleSubmit} className="w-100 px-4 d-flex flex-column align-items-center">
      <Form.Row className="px-0 w-100">
        <Form.Group as={Col} className="px-0">
          <Form.Control
            type="text"
            name="name"
            floatingLabel="Program name"
            placeholder="Search by program name"
            leadingElement={<Icon src={Search} className="mt-2 icon" />}
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            data-testid="program-name-filter"
          />
        </Form.Group>
      </Form.Row>
      <Form.Group className="w-100 d-flex justify-content-end px-0">
        <Button onClick={handleReset} variant="tertiary" text className="mr-2" disabled={isButtonDisabled}>Reset</Button>
        <Button type="submit" disabled={isButtonDisabled}>Apply</Button>
      </Form.Group>
    </Form>
  );
};

ProgramsFilters.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
};

export default ProgramsFilters;
