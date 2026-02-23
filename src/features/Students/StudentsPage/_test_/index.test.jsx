import StudentsPage from 'features/Students/StudentsPage';
import { waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  students: {
    table: {
      data: [
        {
          learnerName: 'Student 1',
          learnerEmail: 'student1@example.com',
          courseId: '1',
          courseName: 'course 1',
          classId: '1',
          className: 'class 1',
          instructors: ['Instructor 1'],
          created: 'Fri, 25 Aug 2023 19:01:22 GMT',
          firstAccess: 'Fri, 25 Aug 2023 19:01:23 GMT',
          lastAccess: 'Fri, 25 Aug 2023 20:20:22 GMT',
          status: 'Active',
          examReady: {
            status: 'READY',
          },
        },
        {
          learnerName: 'Student 2',
          learnerEmail: 'student2@example.com',
          courseId: '2',
          courseName: 'course 2',
          classId: '2',
          className: 'class 2',
          instructors: ['Instructor 2'],
          created: 'Sat, 26 Aug 2023 19:01:22 GMT',
          firstAccess: 'Sat, 26 Aug 2023 19:01:24 GMT',
          lastAccess: 'Sat, 26 Aug 2023 21:22:22 GMT',
          status: 'Pending',
          examReady: {
            status: 'PENDING',
          },
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
    classesMetrics: {
      data: [
        {
          numberOfClassesCreated: 10,
        },
      ],
    },
    studentsMetrics: {
      data: [
        {
          numberOfEnrollments: 2,
        },
      ],
    },
    classes: {
      data: [],
    },
    courses: {
      data: [],
    },
  },
};

describe('StudentsPage', () => {
  it('renders students data and pagination', async () => {
    const component = renderWithProviders(
      <Route
        path="/students"
        element={<StudentsPage />}
      />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students'],
      },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Student 1');
      expect(component.container).toHaveTextContent('Student 2');
      expect(component.container).toHaveTextContent('course 1');
      expect(component.container).toHaveTextContent('course 2');
      expect(component.container).toHaveTextContent('class 1');
      expect(component.container).toHaveTextContent('class 2');
      expect(component.container).toHaveTextContent('Instructor 1');
      expect(component.container).toHaveTextContent('Instructor 2');
      expect(component.container).toHaveTextContent('active');
      expect(component.container).toHaveTextContent('pending');
      expect(component.container).toHaveTextContent('10');
      expect(component.container).toHaveTextContent('2');
    });
  });
});
