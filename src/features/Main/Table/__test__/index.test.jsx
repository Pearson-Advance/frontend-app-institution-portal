import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

import Table from 'features/Main/Table';

describe('Table component', () => {
  const columns = [
    {
      Header: 'Email',
      accessor: 'learnerEmail',
    },
  ];

  const data = [
    { learnerEmail: 'test1@example.com' },
    { learnerEmail: 'test2@example.com' },
  ];

  const count = 2;
  const text = 'No data available';

  test('Should render table with provided data', () => {
    const { getByText } = renderWithProviders(
      <Table columns={columns} data={data} count={count} text={text} />,
    );

    const table = getByText('Email');
    expect(table).toBeInTheDocument();

    const email = getByText(data[0].learnerEmail);
    expect(email).toBeInTheDocument();

    const tableFooter = getByText('Showing 2 of 2.');
    expect(tableFooter).toBeInTheDocument();
  });

  test('Should render empty table with provided text when no data is available', () => {
    const { getByText } = renderWithProviders(
      <Table columns={columns} data={[]} count={0} text={text} />,
    );

    const emptyTable = getByText(text);
    expect(emptyTable).toBeInTheDocument();
  });
});
