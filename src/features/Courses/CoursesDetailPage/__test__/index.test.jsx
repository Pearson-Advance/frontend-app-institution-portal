import React from 'react';
import { waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import { renderWithProviders } from 'test-utils';
import CoursesDetailPage from 'features/Courses/CoursesDetailPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: {
    selectedInstitution: {
      id: 1,
      name: 'Institution 1',
      shortName: 'Test',
      active: true,
      externalId: '',
      created: '2023-06-22T22:48:56.124907Z',
      modified: '2023-06-22T22:48:56.124907Z',
      label: 'Institution 1',
      value: 1,
    },
  },
  courses: {
    table: {
      data: [
        {
          masterCourseName: 'Demo Course 1',
          numberOfClasses: 3,
          missingClassesForInstructor: 0,
          numberOfStudents: 3,
          numberOfPendingStudents: 0,
        },
        {
          masterCourseName: 'Demo Course 2',
          numberOfClasses: 3,
          missingClassesForInstructor: 0,
          numberOfStudents: 3,
          numberOfPendingStudents: 0,
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
  },
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

describe('CoursesDetailPage', () => {
  test('Should render the table and the course info', async () => {
    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201']}>
        <Route path="/courses/:classId">
          <CoursesDetailPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Demo Course 1 1');
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
