import React from 'react';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';

describe('StudentsMetrics component', () => {
  test('renders components', () => {
    const { getByText } = renderWithProviders(
      <StudentsMetrics />,
    );

    expect(getByText('This week')).toBeInTheDocument();
    expect(getByText('Last month')).toBeInTheDocument();
    expect(getByText('Last quarter')).toBeInTheDocument();
    expect(getByText('New students registered')).toBeInTheDocument();
    expect(getByText('Classes scheduled')).toBeInTheDocument();
  });

  test('change period days', () => {
    const { getAllByRole, getByText } = renderWithProviders(
      <StudentsMetrics />,
    );

    const radioInputs = getAllByRole('radio');
    const lastMonth = getByText('Last month');

    expect(radioInputs).toHaveLength(3);
    expect(radioInputs[0]).toBeChecked();
    fireEvent.click(lastMonth);

    expect(radioInputs[0]).not.toBeChecked();
    expect(radioInputs[1]).toBeChecked();
  });
});
