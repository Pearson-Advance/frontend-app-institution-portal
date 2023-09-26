import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import InstructorsTable from 'features/Instructors/InstructorsTable';
import { columns } from 'features/Instructors/InstructorsTable/columns';

describe('Instructor Table', () => {
  test('renders InstructorsTable without data', () => {
    render(<InstructorsTable data={[]} count={0} columns={[]} />);
    const emptyTableText = screen.getByText('No instructors found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders InstructorsTable  with data', () => {
    const data = [
      {
        instructorUsername: 'Instructor1',
        instructorName: 'Instructor 1',
        instructorEmail: 'instructor1@example.com',
        ccxId: 'CCX1',
        ccxName: 'CCX 1',
      },
      {
        instructorUsername: 'Instructor2',
        instructorName: 'Instructor 2',
        instructorEmail: 'instructor2@example.com',
        ccxId: 'CCX2',
        ccxName: 'CCX 2',
      },
    ];

    const component = render(
      <InstructorsTable data={data} count={data.length} columns={columns} />,
    );

    // Check if the table rows are present
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(data.length + 1); // Data rows + 1 header row
    expect(component.container).toHaveTextContent('Instructor1');
    expect(component.container).toHaveTextContent('Instructor2');
    expect(component.container).toHaveTextContent('Instructor 1');
    expect(component.container).toHaveTextContent('Instructor 2');
    expect(component.container).toHaveTextContent('instructor1@example.com');
    expect(component.container).toHaveTextContent('instructor2@example.com');
    expect(component.container).toHaveTextContent('CCX 1');
    expect(component.container).toHaveTextContent('CCX 2');
  });
});
