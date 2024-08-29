import React from 'react';

import { Container } from '@edx/paragon';

import { unauthorizedText } from 'features/constants';

const UnauthorizedPage = () => (
  <Container className="px-0 container-pages">
    <Container size="md" className="p-4 my-4 page-content-container text-center font-weight-bold">
      <p>{unauthorizedText}</p>
    </Container>
  </Container>
);

export default UnauthorizedPage;
