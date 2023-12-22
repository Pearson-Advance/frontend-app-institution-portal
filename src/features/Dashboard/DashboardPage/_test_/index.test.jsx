import React from 'react';
import { render } from '@testing-library/react';
import DashboardPage from 'features/Dashboard/DashboardPage';
import { InstitutionContext } from 'features/Main/institutionContext';
import '@testing-library/jest-dom/extend-expect';

describe('DashboardPage component', () => {
  test('renders components', () => {
    const { getByText } = render(
      <InstitutionContext.Provider value={[{ id: 1, name: 'Institution Name' }]}>
        <DashboardPage />
      </InstitutionContext.Provider>,
    );

    expect(getByText('This week')).toBeInTheDocument();
    expect(getByText('Next week')).toBeInTheDocument();
    expect(getByText('Next month')).toBeInTheDocument();
    expect(getByText('New students registered')).toBeInTheDocument();
    expect(getByText('Classes scheduled')).toBeInTheDocument();
    expect(getByText('Welcome to Institution Name')).toBeInTheDocument();
  });
});
