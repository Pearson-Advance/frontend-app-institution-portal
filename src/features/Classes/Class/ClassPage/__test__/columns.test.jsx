import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';

import { columns } from 'features/Classes/Class/ClassPage/columns';

describe('columns', () => {
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
        results: [
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

  test('Should return an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(7);

    const [
      number,
      student,
      learnerEmail,
      status,
      completePercentage,
      examReady,
    ] = columns;

    expect(number).toHaveProperty('Header', 'No');
    expect(number).toHaveProperty('accessor', 'index');

    expect(student).toHaveProperty('Header', 'Student');
    expect(student).toHaveProperty('accessor', 'learnerName');

    expect(learnerEmail).toHaveProperty('Header', 'Email');
    expect(learnerEmail).toHaveProperty('accessor', 'learnerEmail');

    expect(status).toHaveProperty('Header', 'Status');
    expect(status).toHaveProperty('accessor', 'status');

    expect(completePercentage).toHaveProperty('Header', 'Current Grade');
    expect(completePercentage).toHaveProperty('accessor', 'completePercentage');

    expect(examReady).toHaveProperty('Header', 'Exam ready');
    expect(examReady).toHaveProperty('accessor', 'examReady');
  });

  test('Show student info', async () => {
    const StudentColumn = () => columns[1].Cell({
      row: {
        values: {
          learnerName: 'Test User',
        },
        original: {
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201/test%20ccx1?classId=ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/courses/:courseName/:className">
          <StudentColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('Test User')).toBeInTheDocument();
  });

  test('Show status info', async () => {
    const StatusColumn = () => columns[3].Cell({
      row: {
        values: {
          status: 'Active',
        },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201/test%20ccx1?classId=ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/courses/:courseName/:className">
          <StatusColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('Active')).toBeInTheDocument();
  });

  test('Show exam ready info', async () => {
    const ExamColumn = () => columns[5].Cell({
      row: {
        values: {
          examReady: false,
        },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201/test%20ccx1?classId=ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/courses/:courseName/:className">
          <ExamColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('No')).toBeInTheDocument();
  });

  test('Show menu dropdown', async () => {
    const ActionColumn = () => columns[6].Cell({
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
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201/test%20ccx1?classId=ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/courses/:courseName/:className">
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
