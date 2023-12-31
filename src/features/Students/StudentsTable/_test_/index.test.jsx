import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StudentsTable } from 'features/Students/StudentsTable';
import { getColumns } from 'features/Students/StudentsTable/columns';
import { initializeStore } from 'store';

let store;

describe('Student Table', () => {
  beforeEach(() => {
    store = initializeStore();
  });

  test('renders StudentsTable without data', () => {
    render(
      <Provider store={store}>
        <StudentsTable data={[]} count={0} columns={[]} />
      </Provider>,
    );
    const emptyTableText = screen.getByText('No students found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders StudentsTable with data', () => {
    const data = [
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
        examReady: true,
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
        examReady: null,
      },
    ];

    const component = render(
      <Provider store={store}>
        <StudentsTable data={data} count={data.length} columns={getColumns()} />
      </Provider>,
    );

    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(data.length + 1);

    expect(component.container).toHaveTextContent('Student 1');
    expect(component.container).toHaveTextContent('Student 2');

    expect(component.container).toHaveTextContent('course 1');
    expect(component.container).toHaveTextContent('course 2');

    expect(component.container).toHaveTextContent('class 1');
    expect(component.container).toHaveTextContent('class 2');

    expect(component.container).toHaveTextContent('Instructor 1');
    expect(component.container).toHaveTextContent('Instructor 2');

    expect(component.container).toHaveTextContent('yes');
    expect(component.container).toHaveTextContent('no');

    expect(screen.queryByText('No students found.')).toBeNull();
  });
});
