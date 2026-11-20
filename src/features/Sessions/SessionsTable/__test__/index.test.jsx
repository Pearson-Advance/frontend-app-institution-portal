import React from 'react';
import { render, screen } from '@testing-library/react';
import SessionsTable from 'features/Sessions/SessionsTable';

jest.mock('features/Main/Table', () => jest.fn(({
  isLoading,
  isSortable,
  columns,
  itemCount,
  data,
  text,
}) => (
  <div data-testid="mock-table">
    <span data-testid="table-loading">{String(isLoading)}</span>
    <span data-testid="table-sortable">{String(isSortable)}</span>
    <span data-testid="table-count">{itemCount}</span>
    <span data-testid="table-data-length">{data.length}</span>
    <span data-testid="table-empty-text">{text}</span>
    <span data-testid="table-columns-count">{columns.length}</span>
  </div>
)));

jest.mock('features/Sessions/SessionsTable/columns', () => {
  const cols = [
    { Header: 'Session', accessor: 'name' },
    { Header: 'Program', accessor: 'offeringName' },
    { Header: 'Status', accessor: 'hidden' },
  ];

  return {
    columns: cols,
    getColumns: jest.fn(() => cols),
  };
});

describe('SessionsTable Component', () => {
  const mockSessionsData = [
    { id: '1', name: 'Cohort A', offeringName: 'CS' },
    { id: '2', name: 'Cohort B', offeringName: 'Data Science' },
  ];

  test('renders correctly with default props', () => {
    render(<SessionsTable />);

    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('table-sortable')).toHaveTextContent('true');
    expect(screen.getByTestId('table-count')).toHaveTextContent('0');
    expect(screen.getByTestId('table-data-length')).toHaveTextContent('0');
    expect(screen.getByTestId('table-empty-text')).toHaveTextContent('No sessions were found.');
    expect(screen.getByTestId('table-columns-count')).toHaveTextContent('3');
  });

  test('passes custom data, count, and isLoading props to the Table component', () => {
    render(
      <SessionsTable
        data={mockSessionsData}
        count={25}
        isLoading
      />,
    );

    expect(screen.getByTestId('table-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('table-count')).toHaveTextContent('25');
    expect(screen.getByTestId('table-data-length')).toHaveTextContent('2');
  });

  test('maintains memoized columns across re-renders', () => {
    const { rerender } = render(<SessionsTable data={[]} count={0} isLoading={false} />);
    expect(screen.getByTestId('table-columns-count')).toHaveTextContent('3');

    rerender(<SessionsTable data={mockSessionsData} count={2} isLoading={false} />);
    expect(screen.getByTestId('table-columns-count')).toHaveTextContent('3');
  });
});
