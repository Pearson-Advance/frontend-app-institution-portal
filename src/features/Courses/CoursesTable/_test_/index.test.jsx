import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import CoursesTable from 'features/Courses/CoursesTable';
import { columns } from 'features/Courses/CoursesTable/columns';

describe('Courses Table', () => {
  test('renders CoursesTable without data', () => {
    render(<CoursesTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No instructors found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders CoursessTable  with data', () => {
    const data = [
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
    ];

    const component = render(
      <CoursesTable data={data} count={data.length} columns={columns} />,
    );

    // Check if the table rows are present
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(data.length + 1); // Data rows + 1 header row
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
