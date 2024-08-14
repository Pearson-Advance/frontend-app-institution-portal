import React from 'react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import CoursesPage from 'features/Courses/CoursesPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  courses: {
    table: {
      data: [
        {
          masterCourseName: 'Demo Course 1',
          masterCourseId: 'course-v1:XXX+YYY+2023',
          numberOfClasses: 1,
          missingClassesForInstructor: null,
          numberOfStudents: 1,
          numberOfPendingStudents: 1,
        },
        {
          masterCourseName: 'Demo Course 2',
          masterCourseId: 'course-v1:ZZZ+YYY+2023',
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
    selectOptions: [
      {
        masterCourseName: 'Demo Course 1',
        masterCourseId: 'course-v1:XXX+YYY+2023',
        numberOfClasses: 1,
        missingClassesForInstructor: null,
        numberOfStudents: 1,
        numberOfPendingStudents: 1,
      },
      {
        masterCourseName: 'Demo Course 2',
        masterCourseId: 'course-v1:ZZZ+YYY+2023',
        numberOfClasses: 1,
        missingClassesForInstructor: 1,
        numberOfStudents: 16,
        numberOfPendingStudents: 0,
      },
    ],
  },
};

describe('CoursesPage', () => {
  it('renders courses data and pagination', async () => {
    const component = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}`]}>
        <Route path="/courses/:courseId">
          <CoursesPage />
        </Route>
      </MemoryRouter>,
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
