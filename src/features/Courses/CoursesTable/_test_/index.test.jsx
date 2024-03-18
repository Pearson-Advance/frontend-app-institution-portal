import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import {  screen } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';

import CoursesTable from 'features/Courses/CoursesTable';
import { columns } from 'features/Courses/CoursesTable/columns';

describe('Courses Table', () => {
  test('renders CoursesTable without data', () => {
    renderWithProviders(<CoursesTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No instructors found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders CoursesTable  with data', () => {
    const data = [
      {
        masterCourseName: 'Demo Course 1',
        numberOfClasses: 1,
        missingClassesForInstructor: null,
        numberOfStudents: 1,
        numberOfPendingStudents: 3,
      },
      {
        masterCourseName: 'Demo Course 2',
        numberOfClasses: 1,
        missingClassesForInstructor: 1,
        numberOfStudents: 16,
        numberOfPendingStudents: 0,
      },
    ];

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/courses']}>
        <Route path="/courses">
          <CoursesTable data={data} count={data.length} columns={columns} />
        </Route>
      </MemoryRouter>,
    );

    // Check if the table rows are present
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(data.length + 1); // Data rows + 1 header row
    expect(component.container).toHaveTextContent('Demo Course 1');
    expect(component.container).toHaveTextContent('Demo Course 2');
    expect(component.container).toHaveTextContent('Ready');
    expect(component.container).toHaveTextContent('Missing (1)');
    expect(component.container).toHaveTextContent('1');
    expect(component.container).toHaveTextContent('16');
    expect(component.container).toHaveTextContent('3');
    expect(component.container).toHaveTextContent('0');
  });
});
