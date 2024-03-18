import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { MemoryRouter, Route } from 'react-router-dom';

import ClassesTable from 'features/Classes/ClassesTable';
import { columns } from 'features/Classes/ClassesTable/columns';

describe('Classes Table', () => {
  test('Should render the table without data', () => {
    render(<ClassesTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No classes found.');
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
              minStudentsAllowed: 50,
              numberOfStudents: 1,
              maxStudents: 100,
              instructors: ['instructor_1'],
            },
            {
              masterCourseName: 'Demo MasterCourse 2',
              className: 'Demo Class 2',
              startDate: '09/21/25',
              endDate: null,
              minStudentsAllowed: 200,
              numberOfStudents: 2,
              maxStudents: 10,
              instructors: ['instructor_2', 'instructor_3'],
            },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/classes']}>
        <Route path="/classes">
          <ClassesTable
            data={mockStore.classes.table.data}
            count={mockStore.classes.table.data.length}
            columns={columns}
          />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(component.container).toHaveTextContent('Demo MasterCourse 1');
    expect(component.container).toHaveTextContent('Demo MasterCourse 2');
    expect(component.container).toHaveTextContent('Demo Class 1');
    expect(component.container).toHaveTextContent('Demo Class 2');
    expect(component.container).toHaveTextContent('09/21/24');
    expect(component.container).toHaveTextContent('09/21/25');
    expect(component.container).toHaveTextContent('50');
    expect(component.container).toHaveTextContent('200');
    expect(component.container).toHaveTextContent('1');
    expect(component.container).toHaveTextContent('2');
    expect(component.container).toHaveTextContent('100');
    expect(component.container).toHaveTextContent('10');
    expect(component.container).toHaveTextContent('instructor_1');
    expect(component.container).toHaveTextContent('instructor_2');
    expect(component.container).toHaveTextContent('instructor_3');
  });
});
