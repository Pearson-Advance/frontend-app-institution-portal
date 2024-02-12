import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react';
import AssignInstructors from 'features/Instructors/AssignInstructors';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  instructors: {
    table: {
      data: [
        {
          instructorUsername: 'Instructor1',
          instructorName: 'Instructor 1',
          instructorEmail: 'instructor1@example.com',
          ccxId: 'CCX1',
          ccxName: 'CCX 1',
        },
        {
          instructorUsername: 'Instructor2',
          instructorName: 'Instructor 2',
          instructorEmail: 'instructor2@example.com',
          ccxId: 'CCX2',
          ccxName: 'CCX 2',
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
    classes: {
      data: [],
    },
    courses: {
      data: [],
    },
  },
};

describe('Assign instructors modal', () => {
  test('render assing instructors modal', () => {
    const { getByText, getAllByRole, getByTestId } = renderWithProviders(
      <AssignInstructors isOpen close={() => {}} />,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(getByText('Instructor')).toBeInTheDocument();
      expect(getByText('Instructor1')).toBeInTheDocument();
      expect(getByText('Instructor2')).toBeInTheDocument();
      expect(getByText('Last seen')).toBeInTheDocument();
      expect(getByText('Courses taught')).toBeInTheDocument();
    });

    const checkboxFields = getAllByRole('checkbox');
    fireEvent.click(checkboxFields[0]);

    const assignButton = getByTestId('assignButton');
    fireEvent.click(assignButton);
  });
});
