import { screen } from '@testing-library/react';

import LicensesTable from 'features/Licenses/LicensesTable';
import { columns } from 'features/Licenses/LicensesTable/columns';

import { RequestStatus } from 'features/constants';
import { renderWithProviders } from 'test-utils';

describe('Licenses Table', () => {
  const mockStore = {
    licenses: {
      table: {
        status: RequestStatus.SUCCESS,
      },
    },
  };

  test('renders Licenses table without data', () => {
    renderWithProviders(<LicensesTable data={[]} count={0} columns={[]} />, { preloadedState: mockStore });
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

    const component = renderWithProviders(
      <LicensesTable
        data={data}
        count={data.length}
        columns={columns}
      />,
      { preloadedState: mockStore },
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
