import React, { useContext } from 'react';
import { Container } from '@edx/paragon';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import { InstitutionContext } from 'features/Main/institutionContext';

const DashboardPage = () => {
  const dataInstitution = useContext(InstitutionContext);

  return (
    <Container size="xl">
      <h2 className="title-page">{dataInstitution.length === 1 ? `Welcome to ${dataInstitution[0].name}` : 'Select an institution'}</h2>
      <StudentsMetrics />
    </Container>
  );
};

export default DashboardPage;
