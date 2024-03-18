import React from 'react';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

describe('StudentsMetrics component', () => {
  test('renders components', () => {
    const { getByText } = renderWithProviders(
        <StudentsMetrics />,
    );

    expect(getByText('This week')).toBeInTheDocument();
    expect(getByText('Next week')).toBeInTheDocument();
    expect(getByText('Next month')).toBeInTheDocument();
    expect(getByText('New students registered')).toBeInTheDocument();
    expect(getByText('Classes scheduled')).toBeInTheDocument();
  });
});
