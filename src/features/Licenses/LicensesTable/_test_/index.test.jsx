import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import LicensesTable from 'features/Licenses/LicensesTable';
import { columns } from 'features/Licenses/LicensesTable/columns';

describe('Licenses Table', () => {
  test('renders Licenses table without data', () => {
    render(<LicensesTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No licenses found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders Licenses table  with data', () => {
    const data = [
      {
        licenseName: 'License Name 1',
        purchasedSeats: 20,
        numberOfStudents: 6,
        numberOfPendingStudents: 11,
      },
      {
        licenseName: 'License Name 2',
        purchasedSeats: 10,
        numberOfStudents: 1,
        numberOfPendingStudents: 5,
      },
    ];

    const component = render(
      <LicensesTable data={data} count={data.length} columns={columns} />,
    );

    // Check if the table rows are present
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(data.length + 1); // Data rows + 1 header row
    expect(component.container).toHaveTextContent('License Name 1');
    expect(component.container).toHaveTextContent('License Name 2');
    expect(component.container).toHaveTextContent('20');
    expect(component.container).toHaveTextContent('10');
    expect(component.container).toHaveTextContent('6');
    expect(component.container).toHaveTextContent('1');
    expect(component.container).toHaveTextContent('11');
    expect(component.container).toHaveTextContent('5');
  });
});
