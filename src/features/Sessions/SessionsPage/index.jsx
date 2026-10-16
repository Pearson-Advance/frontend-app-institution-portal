import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from '@openedx/paragon';

import SessionsTable from 'features/Sessions/SessionsTable';

const SessionsPage = () => {
  const { data, count } = useSelector((state) => state.sessions.table);

  return (
    <Container className="px-5">
      <h2 className="title-page">Sessions</h2>
      <div className="page-content-container">
        <SessionsTable data={data} count={count} />
      </div>
    </Container>
  );
};

export default SessionsPage;
