/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SessionDetailTable from 'features/Sessions/SessionDetailTable';

jest.mock('features/Main/Table', () => jest.fn(({
  isLoading, isSortable, itemCount, data, text, columns,
}) => (
  <div data-testid="mock-table">
    <span data-testid="is-loading">{String(isLoading)}</span>
    <span data-testid="is-sortable">{String(isSortable)}</span>
    <span data-testid="item-count">{itemCount}</span>
    <span data-testid="data-length">{data.length}</span>
    <span data-testid="empty-text">{text}</span>
    <span data-testid="columns-count">{columns.length}</span>
  </div>
)));

jest.mock('features/Sessions/SessionDetailTable/columns', () => ({
  columns: [
    { Header: 'Class Name', accessor: 'className' },
    { Header: 'Course Name', accessor: 'courseName' },
  ],
}));

describe('SessionDetailTable', () => {
  const mockData = [
    { classId: '1', className: 'CS101 - A' },
    { classId: '2', className: 'CS102 - B' },
  ];

  it('renders correctly with default props', () => {
    render(<SessionDetailTable />);

    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('is-sortable')).toHaveTextContent('true');
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('data-length')).toHaveTextContent('0');
    expect(screen.getByTestId('empty-text')).toHaveTextContent('No classes were found.');
    expect(screen.getByTestId('columns-count')).toHaveTextContent('2');
  });

  it('passes custom data, count, and isLoading props to the Table component', () => {
    render(
      <SessionDetailTable
        data={mockData}
        count={10}
        isLoading
      />,
    );

    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('item-count')).toHaveTextContent('10');
    expect(screen.getByTestId('data-length')).toHaveTextContent('2');
  });
});
