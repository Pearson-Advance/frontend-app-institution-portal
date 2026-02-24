import React from 'react';
import { Container } from '@openedx/paragon';

import { UNAUTHORIZED_HELP_MESSAGE, SUPPORT_EMAIL } from 'features/constants';

const UnauthorizedPage = () => (
  <Container className="px-0 container-pages">
    <Container size="md" className="p-4 my-4 page-content-container text-center font-weight-bold">
      <p>
        {UNAUTHORIZED_HELP_MESSAGE} {' '}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {SUPPORT_EMAIL}
        </a>.
      </p>
    </Container>
  </Container>
);

export default UnauthorizedPage;
