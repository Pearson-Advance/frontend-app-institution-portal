import React from 'react';
import { render } from '@testing-library/react';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import '@testing-library/jest-dom/extend-expect';

describe('StudentsMetrics component', () => {
  test('renders components', () => {
    const { getByText } = render(
      <StudentsMetrics />,
    );

    expect(getByText('This week')).toBeInTheDocument();
    expect(getByText('Next week')).toBeInTheDocument();
    expect(getByText('Next month')).toBeInTheDocument();
    expect(getByText('New students registered')).toBeInTheDocument();
    expect(getByText('Classes scheduled')).toBeInTheDocument();
  });
});
