import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from '@edx/paragon';
import StudentsMetrics from 'features/Students/StudentsMetrics';

const DashboardPage = () => {
  const stateInstitution = useSelector((state) => state.main.institution.data);

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">
        {stateInstitution.length === 1 ? `Welcome to ${stateInstitution[0].name}` : 'Select an institution'}
      </h2>
      <StudentsMetrics />
    </Container>
  );
};

export default DashboardPage;
