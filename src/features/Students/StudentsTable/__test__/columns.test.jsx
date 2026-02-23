import { fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import { columns } from 'features/Students/StudentsTable/columns';

describe('StudentsTable Columns', () => {
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
            examReady: {
              status: 'NOT_STARTED',
              last_exam_date: null,
              epp_days_left: 3,
            },
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
    expect(columns).toHaveLength(10);

    const [
      studentCol,
      emailCol,
      statusCol,
      classNameCol,
      dateCol,
      progressColumn,
      examReadyCol,
      lastExamCol,
      eppDaysLeftCol,
      actionCol,
    ] = columns;

    expect(studentCol).toHaveProperty('Header', 'Student');
    expect(studentCol).toHaveProperty('accessor', 'learnerName');

    expect(emailCol).toHaveProperty('Header', 'Email');
    expect(emailCol).toHaveProperty('accessor', 'learnerEmail');

    expect(statusCol).toHaveProperty('Header', 'Status');
    expect(statusCol).toHaveProperty('accessor', 'status');

    expect(classNameCol).toHaveProperty('Header', 'Class Name');
    expect(classNameCol).toHaveProperty('accessor', 'className');

    expect(dateCol).toHaveProperty('Header', 'Start - End Date');
    expect(dateCol).toHaveProperty('accessor', 'startDate');

    expect(progressColumn).toHaveProperty('Header', 'Current Grade');
    expect(progressColumn).toHaveProperty('accessor', 'completePercentage');

    expect(examReadyCol).toHaveProperty('Header', 'Exam Ready');
    expect(examReadyCol).toHaveProperty('accessor', 'examReady');

    expect(lastExamCol).toHaveProperty('Header', 'Last exam date');
    expect(lastExamCol).toHaveProperty('accessor', 'examReady.lastExamDate');

    expect(eppDaysLeftCol).toHaveProperty('accessor', 'examReady.eppDaysLeft');
    expect(typeof eppDaysLeftCol.Header).toBe('function');

    expect(actionCol).toHaveProperty('accessor', 'classId');
  });

  test('renders dropdown menu correctly', async () => {
    const ActionColumn = () => columns[9].Cell({
      row: {
        values: {
          classId: 'CCX1',
          status: 'Active',
        },
        original: {
          classId: 'CCX1',
          userId: '1',
          learnerEmail: 'test@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <Route path="/students" element={<ActionColumn />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students'],
      },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('renders EPP Days Left cell with correct value', () => {
    const EppDaysColumn = columns[8];
    const CellComponent = () => EppDaysColumn.Cell({
      row: {
        values: {
          examReady: { eppDaysLeft: 3 },
        },
      },
    });

    const { getByText } = renderWithProviders(
      <Route path="/" element={<CellComponent />} />,
      { preloadedState: mockStore },
    );

    expect(getByText('3')).toBeInTheDocument();
  });

  test('renders EPP Days Left cell as "--" when null', () => {
    const EppDaysColumn = columns[8];
    const CellComponent = () => EppDaysColumn.Cell({
      row: {
        values: {
          examReady: { eppDaysLeft: null },
        },
      },
    });

    const { getByText } = renderWithProviders(
      <Route path="/" element={<CellComponent />} />,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });
});
