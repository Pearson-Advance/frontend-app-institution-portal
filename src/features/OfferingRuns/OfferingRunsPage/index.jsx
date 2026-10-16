import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from '@openedx/paragon';

import OfferingRunsTable from 'features/OfferingRuns/OfferingRunsTable';

const OfferingRunsPage = () => {
  const { data, count } = useSelector((state) => state.offeringRuns.table);

  return (
    <Container className="px-5">
      <h2 className="title-page">Offering runs</h2>
      <div className="page-content-container">
        <OfferingRunsTable data={data} count={count} />
      </div>
    </Container>
  );
};

export default OfferingRunsPage;
