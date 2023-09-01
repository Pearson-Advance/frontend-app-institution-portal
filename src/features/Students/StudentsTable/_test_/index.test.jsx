import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StudentsTable } from 'features/Students/StudentsTable';
import { getColumns } from 'features/Students/StudentsTable/columns';

describe('Student Table', () => {
  test('render StudentsTable without data', () => {
    render(<StudentsTable data={[]} count={0} columns={[]} />);
    expect(screen.getByText(/No students found/)).toBeInTheDocument();
  });

  test('render StudentsTable with data', () => {
    const data = [
      {
        learner_name: 'Student 1',
        learner_email: 'student1@example.com',
        ccx_name: 'CCX 1',
        instructors: ['Instructor 1'],
        created: 'Fri, 25 Aug 2023 19:01:22 GMT',
      },
      {
        learner_name: 'Student 2',
        learner_email: 'student2@example.com',
        ccx_name: 'CCX 2',
        instructors: ['Instructor 2'],
        created: 'Sat, 26 Aug 2023 19:01:22 GMT',
      },
    ];

    const component = render(
      <StudentsTable data={data} count={data.length} columns={getColumns()} />,
    );

    // This should have 3 table rows, inside the table component, 1 for the header and 3 for studetns
    const tableRows = component.container.querySelectorAll('tr');

    expect(component.container).not.toHaveTextContent('No students found.');
    expect(tableRows).toHaveLength(3);

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

    // Check datetime is formatted
    expect(component.container).toHaveTextContent('Fri, 25 Aug 2023 19:01:22 GMT');
    expect(component.container).toHaveTextContent('Sat, 26 Aug 2023 19:01:22 GMT');
  });
});
