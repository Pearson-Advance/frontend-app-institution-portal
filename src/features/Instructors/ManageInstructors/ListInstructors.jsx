import React from 'react';
import PropTypes from 'prop-types';

import { Container, Spinner, Row } from '@edx/paragon';

const ListInstructors = ({ instructors, isLoading }) => (
  <Container size="xl" className="p-4 mt-3 instructors-content">
    <Row className="justify-content-center my-4 my-3 px-3">
      <h3 className="pb-2 col-12 px-0">Currently assigned instructors</h3>
      {isLoading && (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner
            animation="border"
            className="mie-3"
            screenReaderText="loading"
          />
        </div>
      )}
      {instructors.length > 0 && (
        <div className="list-instructors col-12 px-0">
          {instructors.map(instructor => <p className="list-item" key={instructor}>{instructor}</p>)}
        </div>
      )}
      {instructors.length === 0 && <p className="empty-list m-0 py-2 px-0 col-12">No records found.</p>}
    </Row>
  </Container>
);

ListInstructors.propTypes = {
  instructors: PropTypes.arrayOf(PropTypes.shape([])),
  isLoading: PropTypes.bool,
};

ListInstructors.defaultProps = {
  instructors: [],
  isLoading: false,
};

export default ListInstructors;
