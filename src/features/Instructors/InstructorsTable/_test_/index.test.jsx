import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { renderWithProviders } from 'test-utils';

import InstructorsTable from 'features/Instructors/InstructorsTable';
import { getColumns } from 'features/Instructors/InstructorsTable/columns';

jest.mock('@edx/frontend-platform/config', () => ({
  getConfig: jest.fn().mockReturnValue({
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v1',
  }),
}));

describe('Instructor Table', () => {
  const mockData = [
    {
      instructorEmail: 'instructor01@example.com',
      instructorName: 'Instructor 1',
      instructorUsername: 'Instructor01',
      classes: 1,
      courses: ['Demo Course 1'],
      lastAcess: '2023-11-29T02:17:41.213175Z',
      active: true,
      hasEnrollmentPrivilege: true,
    },
    {
      instructorUsername: 'Instructor02',
      instructorName: 'Instructor 2',
      instructorEmail: 'instructor02@example.com',
      classes: 1,
      courses: ['Demo Course 1'],
      lastAcess: '2023-10-04T15:02:17.016088Z',
      active: false,
      hasEnrollmentPrivilege: true,
    },
  ];

  test('renders InstructorsTable without data', () => {
    renderWithProviders(<InstructorsTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No instructors found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders InstructorsTable  with data', () => {
    getConfig.mockImplementation(() => ({ SHOW_INSTRUCTOR_FEATURES: true }));
    const { container, getByTestId, getByText } = renderWithProviders(
      <Route
        path="/instructors"
        element={<InstructorsTable data={mockData} count={mockData.length} columns={getColumns()} />}
      />,
      { initialEntries: ['/instructors'] },
    );

    // Check if the table rows are present
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(mockData.length + 1); // Data rows + 1 header row
    expect(container).toHaveTextContent('Instructor 1');
    expect(container).toHaveTextContent('Instructor 2');
    expect(container).toHaveTextContent('instructor01@example.com');
    expect(container).toHaveTextContent('instructor02@example.com');
    expect(container).toHaveTextContent('1');
    expect(container).toHaveTextContent('Active');

    waitFor(() => {
      const actionButton = getByTestId('droprown-action');
      fireEvent.click(actionButton);

      expect(getByText('Edit Instructor')).toBeInTheDocument();
    });
  });

  test('Should not render columns if the flag is false', () => {
    getConfig.mockImplementation(() => ({ SHOW_INSTRUCTOR_FEATURES: false }));

    const { queryByText, queryByTestId } = renderWithProviders(
      <Route
        path="/instructors"
        element={<InstructorsTable data={mockData} count={mockData.length} columns={getColumns()} />}
      />,
      { initialEntries: ['/instructors'] },
    );

    expect(queryByText('Active')).not.toBeInTheDocument();
    const actionButton = queryByTestId('droprown-action');
    expect(actionButton).not.toBeInTheDocument();
  });
});
