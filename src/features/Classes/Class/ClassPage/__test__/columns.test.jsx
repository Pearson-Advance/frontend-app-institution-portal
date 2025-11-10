import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import { columns } from 'features/Classes/Class/ClassPage/columns';

describe('ClassPage Columns', () => {
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
            classId: 'ccx-v1:demo+demo1+2020+ccx@3',
            className: 'test ccx1',
            status: 'Active',
            completePercentage: 0.5,
            examReady: {
              status: 'NOT_STARTED',
              lastExamDate: null,
              eppDaysLeft: 3,
            },
          },
        ],
      },
    },
  };

  test('should return an array of columns with correct headers and accessors', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(9);

    const [
      number,
      student,
      learnerEmail,
      status,
      progress,
      examReady,
      lastExam,
      eppDaysLeft,
      actions,
    ] = columns;

    expect(number).toHaveProperty('Header', 'No');
    expect(number).toHaveProperty('accessor', 'index');

    expect(student).toHaveProperty('Header', 'Student');
    expect(student).toHaveProperty('accessor', 'learnerName');

    expect(learnerEmail).toHaveProperty('Header', 'Email');
    expect(learnerEmail).toHaveProperty('accessor', 'learnerEmail');

    expect(status).toHaveProperty('Header', 'Status');
    expect(status).toHaveProperty('accessor', 'status');

    expect(progress).toHaveProperty('Header', 'Courseware Progress');
    expect(progress).toHaveProperty('accessor', 'completePercentage');

    expect(examReady).toHaveProperty('Header', 'Exam Ready');
    expect(examReady).toHaveProperty('accessor', 'examReady');

    expect(lastExam).toHaveProperty('Header', 'Last exam date');
    expect(lastExam).toHaveProperty('accessor', 'examReady.lastExamDate');

    expect(eppDaysLeft).toHaveProperty('accessor', 'examReady.eppDaysLeft');
    expect(typeof eppDaysLeft.Header).toBe('function');

    expect(actions).toHaveProperty('accessor', 'classId');
  });

  test('renders Student cell with correct link', () => {
    const StudentColumn = () => columns[1].Cell({
      row: {
        values: { learnerName: 'Test User' },
        original: { learnerEmail: 'testuser@example.com' },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <Route>
          <StudentColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const link = getByText('Test User');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  test('renders Status badge correctly', () => {
    const StatusColumn = () => columns[3].Cell({
      row: { values: { status: 'Active' } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <StatusColumn />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('Active')).toBeInTheDocument();
  });

  test('renders ProgressBar with correct value', () => {
    const ProgressColumn = () => columns[4].Cell({
      row: { values: { completePercentage: 50 } },
    });

    const { container } = renderWithProviders(
      <MemoryRouter>
        <ProgressColumn />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toBeInTheDocument();
  });

  test('renders Exam Ready status correctly', () => {
    const ExamReadyColumn = () => columns[5].Cell({
      row: { values: { examReady: { status: 'NOT_STARTED' } } },
    });

    const { container } = renderWithProviders(
      <MemoryRouter>
        <ExamReadyColumn />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(container.querySelector('.progress-steps')).toBeInTheDocument();
  });

  test('renders Last exam date as "--" when null', () => {
    const LastExamColumn = () => columns[6].Cell({
      row: { values: { examReady: { lastExamDate: null } } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <LastExamColumn />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders EPP Days Left correctly', () => {
    const EppDaysColumn = () => columns[7].Cell({
      row: { values: { examReady: { eppDaysLeft: 3 } } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <EppDaysColumn />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('3')).toBeInTheDocument();
  });

  test('renders EPP Days Left as "--" when null', () => {
    const EppDaysColumn = () => columns[7].Cell({
      row: { values: { examReady: { eppDaysLeft: null } } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <EppDaysColumn />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders dropdown menu and actions', () => {
    const ActionColumn = () => columns[8].Cell({
      row: {
        values: { classId: 'CCX1', status: 'Active' },
        original: {
          classId: 'CCX1',
          userId: '1',
          learnerEmail: 'test@example.com',
          courseId: 'course-v1:demo+demo1+2020',
          status: 'Active',
        },
      },
    });

    const component = renderWithProviders(
      <MemoryRouter>
        <Route>
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
