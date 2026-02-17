import { waitFor } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import { Route } from 'react-router-dom';

import ClassesPage from 'features/Classes/ClassesPage';
import { columns } from 'features/Classes/ClassesTable/columns';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const classesResponse = [
  {
    masterCourseName: 'Demo MasterCourse 1',
    className: 'Demo Class 1',
    startDate: '2024-09-21',
    endDate: null,
    numberOfStudents: 1,
    maxStudents: 100,
    instructors: ['instructor_1'],
  },
  {
    masterCourseName: 'Demo MasterCourse 2',
    className: 'Demo Class 2',
    startDate: '2025-09-21',
    endDate: null,
    numberOfStudents: 2,
    maxStudents: 200,
    instructors: ['instructor_2'],
  },
];

const mockStore = {
  classes: {
    table: {
      data: classesResponse,
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
    allClasses: {
      data: classesResponse,
      count: 2,
      status: 'SUCCESS',
      error: null,
    },
  },
};

describe('ClassesPage', () => {
  it('renders classes data and pagination', async () => {
    const component = renderWithProviders(
        <Route path="/classes"
          element={
          <ClassesPage
            data={mockStore.classes.table.data}
            count={mockStore.classes.table.data.length}
            columns={columns}
          />}
        />,
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
