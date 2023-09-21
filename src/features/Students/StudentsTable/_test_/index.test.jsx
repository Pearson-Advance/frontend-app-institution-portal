import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StudentsTable } from 'features/Students/StudentsTable';
import { getColumns } from 'features/Students/StudentsTable/columns';

describe('Student Table', () => {
  test('renders StudentsTable without data', () => {
    render(<StudentsTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No students found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders StudentsTable with data', () => {
    const data = [
      {
        learnerName: 'Student 1',
        learnerEmail: 'student1@example.com',
        ccxName: 'CCX 1',
        instructors: ['Instructor 1'],
        created: 'Fri, 25 Aug 2023 19:01:22 GMT',
        firstAccess: 'Fri, 25 Aug 2023 19:01:23 GMT',
        lastAccess: 'Fri, 25 Aug 2023 20:20:22 GMT',
        grade: true,
      },
      {
        learnerName: 'Student 2',
        learnerEmail: 'student2@example.com',
        ccxName: 'CCX 2',
        instructors: ['Instructor 2'],
        created: 'Sat, 26 Aug 2023 19:01:22 GMT',
        firstAccess: 'Sat, 26 Aug 2023 19:01:24 GMT',
        lastAccess: 'Sat, 26 Aug 2023 21:22:22 GMT',
        grade: false,
      },
    ];

    const component = render(
      <StudentsTable data={data} count={data.length} columns={getColumns()} />,
    );

    // Check if the table rows are present
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(data.length + 1); // Data rows + 1 header row

    // Check student names
    expect(component.container).toHaveTextContent('Student 1');
    expect(component.container).toHaveTextContent('Student 2');

    // Check student emails
    expect(component.container).toHaveTextContent('student1@example.com');
    expect(component.container).toHaveTextContent('student2@example.com');

    // Check ccx names
    expect(component.container).toHaveTextContent('CCX 1');
    expect(component.container).toHaveTextContent('CCX 2');

    // Check instructors names
    expect(component.container).toHaveTextContent('Instructor 1');
    expect(component.container).toHaveTextContent('Instructor 2');

    // Check datetime for created column is formatted
    expect(component.container).toHaveTextContent('Fri, 25 Aug 2023 19:01:22 GMT');
    expect(component.container).toHaveTextContent('Sat, 26 Aug 2023 19:01:22 GMT');

    // Check datetime for first access column is formatted
    expect(component.container).toHaveTextContent('Fri, 25 Aug 2023 19:01:23 GMT');
    expect(component.container).toHaveTextContent('Sat, 26 Aug 2023 19:01:24 GMT');

    // Check datetime for last access column is formatted
    expect(component.container).toHaveTextContent('Fri, 25 Aug 2023 20:20:22 GMT');
    expect(component.container).toHaveTextContent('Sat, 26 Aug 2023 21:22:22 GMT');

    // Check grade
    expect(component.container).toHaveTextContent('pass');
    expect(component.container).toHaveTextContent('fail');

    // Ensure "No students found." is not present
    expect(screen.queryByText('No students found.')).toBeNull();
  });
});
