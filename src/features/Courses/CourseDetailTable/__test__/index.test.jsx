import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import CourseDetailTable from 'features/Courses/CourseDetailTable';
import { columns } from 'features/Courses/CourseDetailTable/columns';

describe('Course Details Table', () => {
  test('Should render the table without data', () => {
    render(<CourseDetailTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No classes were found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('Should render the table with data', () => {
    const mockStore = {
      classes: {
        table: {
          data: [
            {
              masterCourseName: 'Demo MasterCourse 1',
              className: 'Demo Class 1',
              startDate: '09/21/24',
              endDate: null,
              min: 10,
              numberOfStudents: 1,
              maxStudents: 100,
              instructors: ['instructor_1'],
            },
            {
              masterCourseName: 'Demo MasterCourse 2',
              className: 'Demo Class 2',
              startDate: '09/21/25',
              endDate: null,
              min: 2,
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

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/courses']}>
        <Route path="/courses">
          <CourseDetailTable
            data={mockStore.classes.table.data}
            count={mockStore.classes.table.data.length}
            columns={columns}
          />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(component.container).toHaveTextContent('Class');
    expect(component.container).toHaveTextContent('Instructor');
    expect(component.container).toHaveTextContent('Enrollment status');
    expect(component.container).toHaveTextContent('Min');
    expect(component.container).toHaveTextContent('Students Enrolled');
    expect(component.container).toHaveTextContent('Max');
    expect(component.container).toHaveTextContent('Start date');
    expect(component.container).toHaveTextContent('End date');
  });
});
