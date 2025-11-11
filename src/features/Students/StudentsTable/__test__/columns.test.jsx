import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { renderWithProviders } from 'test-utils';

import { columns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  const mockStore = {
    main: {
      selectedInstitution: {
        id: 1,
      },
    },
    students: {
      table: {
        next: null,
        previous: null,
        count: 1,
        numPages: 1,
        currentPage: 1,
        start: 0,
        data: [
          {
            learnerName: 'Test User',
            learnerEmail: 'testuser@example.com',
            courseId: 'course-v1:demo+demo1+2020',
            courseName: 'Demo Course 1',
            classId: 'ccx-v1:demo+demo1+2020+ccx@3',
            className: 'test ccx1',
            created: '2024-02-13T18:31:27.399407Z',
            status: 'Active',
            examReady: false,
            startDate: '2024-02-13T17:42:22Z',
            endDate: null,
            completePercentage: 0.0,
          },
        ],
      },
    },
  };

  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(8);

    const [
      nameColumn,
      emailColumn,
      statusColumn,
      classNameColumn,
      dateColumn,
      progressColumn,
      examReadyColumn,
    ] = columns;

    expect(nameColumn).toHaveProperty('Header', 'Student');
    expect(nameColumn).toHaveProperty('accessor', 'learnerName');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'learnerEmail');

    expect(statusColumn).toHaveProperty('Header', 'Status');
    expect(statusColumn).toHaveProperty('accessor', 'status');

    expect(classNameColumn).toHaveProperty('Header', 'Class Name');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(dateColumn).toHaveProperty('Header', 'Start - End Date');
    expect(dateColumn).toHaveProperty('accessor', 'startDate');

    expect(progressColumn).toHaveProperty('Header', 'Current Grade');
    expect(progressColumn).toHaveProperty('accessor', 'completePercentage');

    expect(examReadyColumn).toHaveProperty('Header', 'Exam Ready');
    expect(examReadyColumn).toHaveProperty('accessor', 'examReady');
  });

  test('Show menu dropdown', async () => {
    const ActionColumn = () => columns[7].Cell({
      row: {
        values: {
          classId: 'CCX1',
        },
        original: {
          classId: 'CCX1',
          userId: '1',
        },
      },
    });

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/students/']}>
        <Route path="/students/">
          <ActionColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);
    expect(component.getByText('View progress')).toBeInTheDocument();
  });
});
