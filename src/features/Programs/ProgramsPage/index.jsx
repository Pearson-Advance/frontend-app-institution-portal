import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from '@openedx/paragon';

import ProgramsTable from 'features/Programs/ProgramsTable';

const ProgramsPage = () => {
  const { data, count } = useSelector((state) => state.programs.table);

  return (
    <Container className="px-5">
      <h2 className="title-page">Programs</h2>
      <div className="page-content-container">
        <ProgramsTable data={data} count={count} />
      </div>
    </Container>
  );
};

export default ProgramsPage;
