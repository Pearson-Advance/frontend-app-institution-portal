import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import ProgramDetailTable from 'features/Programs/ProgramDetailTable';

jest.mock('features/Main/Table', () => jest.fn(({
  isLoading,
  isSortable,
  columns,
  itemCount,
  data,
  text,
}) => (
  <div data-testid="mock-table">
    <span data-testid="is-loading">{isLoading ? 'loading' : 'idle'}</span>
    <span data-testid="is-sortable">{isSortable ? 'sortable' : 'not-sortable'}</span>
    <span data-testid="item-count">{itemCount}</span>
    <span data-testid="empty-text">{text}</span>
    <span data-testid="columns-count">{columns.length}</span>
    <span data-testid="data-count">{data.length}</span>
  </div>
)));

jest.mock('features/Programs/ProgramDetailTable/columns', () => ({
  columns: [
    { Header: 'Session Name', accessor: 'sessionName' },
    { Header: 'Instructor', accessor: 'instructors' },
  ],
}));

describe('ProgramDetailTable Component', () => {
  const mockData = [
    { sessionId: 's1', sessionName: 'Cohort 1' },
    { sessionId: 's2', sessionName: 'Cohort 2' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Table component with default props when no data is provided', () => {
    renderWithProviders(<ProgramDetailTable />);

    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    expect(screen.getByTestId('is-loading')).toHaveTextContent('idle');
    expect(screen.getByTestId('is-sortable')).toHaveTextContent('sortable');
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('data-count')).toHaveTextContent('0');
    expect(screen.getByTestId('empty-text')).toHaveTextContent('No sessions were found.');
  });

  it('passes isLoading state correctly to Table component', () => {
    renderWithProviders(<ProgramDetailTable isLoading />);

    expect(screen.getByTestId('is-loading')).toHaveTextContent('loading');
  });

  it('passes data, count, and columns correctly to Table component', () => {
    renderWithProviders(
      <ProgramDetailTable data={mockData} count={2} isLoading={false} />,
    );

    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    expect(screen.getByTestId('is-loading')).toHaveTextContent('idle');
    expect(screen.getByTestId('item-count')).toHaveTextContent('2');
    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
    expect(screen.getByTestId('columns-count')).toHaveTextContent('2');
  });
});
