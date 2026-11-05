import React from 'react';
import { render, screen } from '@testing-library/react';

import { columns } from 'features/Programs/ProgramCoursesTable/columns';
import ProgramCoursesTable from 'features/Programs/ProgramCoursesTable';

const mockTable = jest.fn();
jest.mock('features/Main/Table', () => ({
  __esModule: true,
  default: (props) => {
    mockTable(props);
    return (
      <div data-testid="mock-table">
        <span>Loading: {props.isLoading ? 'true' : 'false'}</span>
        <span>Count: {props.itemCount}</span>
        <span>Items: {props.data.length}</span>
        <span>EmptyText: {props.text}</span>
      </div>
    );
  },
}));

jest.mock('features/Programs/ProgramCoursesTable/columns', () => ({
  columns: [
    { Header: 'Course Name', accessor: 'courseName' },
    { Header: 'Sessions', accessor: 'numberOfSessions' },
  ],
}));

describe('ProgramCoursesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Table component with provided props and correct defaults', () => {
    const mockData = [
      { id: '1', courseName: 'Course 1' },
      { id: '2', courseName: 'Course 2' },
    ];

    render(
      <ProgramCoursesTable
        data={mockData}
        count={2}
        isLoading={false}
      />,
    );

    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: false,
        isSortable: true,
        columns,
        itemCount: 2,
        data: mockData,
        text: 'No courses were found for this program.',
      }),
    );
  });

  test('passes default props when optional props are not provided', () => {
    render(<ProgramCoursesTable />);

    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: false,
        isSortable: true,
        columns,
        itemCount: 0,
        data: [],
        text: 'No courses were found for this program.',
      }),
    );
  });

  test('passes isLoading as true when loading state is active', () => {
    render(<ProgramCoursesTable isLoading />);

    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: true,
      }),
    );
  });
});
