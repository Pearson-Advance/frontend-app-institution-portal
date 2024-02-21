import React from 'react';
import ClassesPage from 'features/Classes/ClassesPage';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  classes: {
    table: {
      data: [
        {
          masterCourseName: 'Demo MasterCourse 1',
          className: 'Demo Class 1',
          startDate: '09/21/24',
          endDate: null,
          numberOfStudents: 1,
          maxStudents: 100,
          instructors: ['instructor_1'],
        },
        {
          masterCourseName: 'Demo MasterCourse 2',
          className: 'Demo Class 2',
          startDate: '09/21/25',
          endDate: null,
          numberOfStudents: 2,
          maxStudents: 200,
          instructors: ['instructor_2'],
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
  },
};

describe('ClassesPage', () => {
  it('renders classes data and pagination', async () => {
    const component = renderWithProviders(
      <ClassesPage />,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Demo MasterCourse 1');
      expect(component.container).toHaveTextContent('Demo MasterCourse 2');
      expect(component.container).toHaveTextContent('Demo Class 1');
      expect(component.container).toHaveTextContent('Demo Class 2');
      expect(component.container).toHaveTextContent('09/21/24');
      expect(component.container).toHaveTextContent('09/21/25');
      expect(component.container).toHaveTextContent('1');
      expect(component.container).toHaveTextContent('2');
      expect(component.container).toHaveTextContent('100');
      expect(component.container).toHaveTextContent('200');
      expect(component.container).toHaveTextContent('instructor_1');
      expect(component.container).toHaveTextContent('instructor_2');
    });
  });
});
