import React from 'react';
import CoursesPage from 'features/Courses/CoursesPage';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  courses: {
    table: {
      data: [
        {
          masterCourseName: 'Demo Course 1',
          numberOfClasses: 1,
          missingClassesForInstructor: null,
          numberOfStudents: 1,
          numberOfPendingStudents: 1,
        },
        {
          masterCourseName: 'Demo Course 2',
          numberOfClasses: 1,
          missingClassesForInstructor: 1,
          numberOfStudents: 16,
          numberOfPendingStudents: 0,
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
  },
};

describe('CoursesPage', () => {
  it('renders courses data and pagination', async () => {
    const component = renderWithProviders(
      <CoursesPage />,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Demo Course 1');
      expect(component.container).toHaveTextContent('Demo Course 2');
      expect(component.container).toHaveTextContent('Ready');
      expect(component.container).toHaveTextContent('Missing (1)');
      expect(component.container).toHaveTextContent('Pending (1)');
      expect(component.container).toHaveTextContent('Complete');
      expect(component.container).toHaveTextContent('1/2');
      expect(component.container).toHaveTextContent('16/16');
    });
  });
});
