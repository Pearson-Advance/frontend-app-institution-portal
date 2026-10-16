import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from '@openedx/paragon';

import OfferingsTable from 'features/Offerings/OfferingsTable';

const OfferingsPage = () => {
  const { data, count } = useSelector((state) => state.offerings.table);

  return (
    <Container className="px-5">
      <h2 className="title-page">Offerings</h2>
      <div className="page-content-container">
        <OfferingsTable data={data} count={count} />
      </div>
    </Container>
  );
};

export default OfferingsPage;
