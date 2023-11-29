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
        instructorEmail: 'instructor01@example.com',
        instructorName: 'Instructor 1',
        instructorUsername: 'Instructor01',
        classes: 1,
        courses: ['Demo Course 1'],
        lastAcess: '2023-11-29T02:17:41.213175Z',
      },
      {
        instructorUsername: 'Instructor02',
        instructorName: 'Instructor 2',
        instructorEmail: 'instructor02@example.com',
        classes: 1,
        courses: ['Demo Course 1'],
        lastAcess: '2023-10-04T15:02:17.016088Z',
      },
    ];

    const component = render(
      <InstructorsTable data={data} count={data.length} columns={columns} />,
    );

    // Check if the table rows are present
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(data.length + 1); // Data rows + 1 header row
    expect(component.container).toHaveTextContent('Instructor01');
    expect(component.container).toHaveTextContent('Instructor02');
    expect(component.container).toHaveTextContent('instructor01@example.com');
    expect(component.container).toHaveTextContent('instructor02@example.com');
    expect(component.container).toHaveTextContent('1');
  });
});
