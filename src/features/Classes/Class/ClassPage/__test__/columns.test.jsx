import { Route } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import { getColumns } from '../columns';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    PSS_ENABLE_ASSIGN_VOUCHER: true,
    LEARNING_MICROFRONTEND_URL: 'http://localhost:2000',
  })),
}));

describe('getColumns', () => {
  const mockStore = {
    main: {
      selectedInstitution: { id: 1 },
    },
    students: {
      table: {
        results: [
          {
            user_id: 1,
            learnerName: 'Test User',
            learnerEmail: 'testuser@example.com',
            courseId: 'course-v1:demo+demo1+2020',
            courseName: 'Demo Course 1',
            classId: 'ccx-v1:demo+demo1+2020+ccx@3',
            className: 'test ccx1',
            status: 'Active',
            examReady: {
              status: 'NOT_STARTED',
              lastExamDate: null,
              eppDaysLeft: 3,
            },
            completePercentage: 0.5,
          },
        ],
      },
      vouchers: {
        results: [
          {
            id: 1,
            created: '2025-11-11T13:28:27.376964Z',
            modified: '2025-11-11T17:42:13.680764Z',
            discount_code: '',
            institution_uuid: 'e6370720-6e6b-4c22-9d5d-49e0da0d3dbe',
            master_course_id: 'course-v1:VUE+9780138261375+2025',
            exam_series_code: 'CODE-TEST',
            status: 'Available',
            computedStatus: 'assigned',
            user: 1,
          },
        ],
      },
    },
  };

  test('Should return an array of columns with correct properties', () => {
    const columns = getColumns({ enableVoucherColumn: true });

    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(10);

    const [
      number,
      student,
      learnerEmail,
      status,
      voucherStatus,
      completePercentage,
      examReady,
      lastExam,
      eppDaysLeft,
      actions,
    ] = columns;

    expect(number).toHaveProperty('Header', 'No');
    expect(student).toHaveProperty('Header', 'Student');
    expect(learnerEmail).toHaveProperty('Header', 'Email');
    expect(status).toHaveProperty('Header', 'Status');
    expect(voucherStatus).toHaveProperty('Header', 'Voucher Status');
    expect(completePercentage).toHaveProperty('Header', 'Current Grade');
    expect(examReady).toHaveProperty('Header', 'Exam Ready');
    expect(lastExam).toHaveProperty('Header', 'Last exam date');
    expect(eppDaysLeft).toHaveProperty('accessor', 'examReady.eppDaysLeft');
    expect(actions).toHaveProperty('accessor', 'classId');
  });

  test('renders Student cell with link', () => {
    const columns = getColumns();

    const StudentColumn = () => columns[1].Cell({
      row: {
        values: { learnerName: 'Test User' },
        original: { learnerEmail: 'testuser@example.com' },
      },
    });

    const { getByText } = renderWithProviders(
        <Route path="/courses/:courseName/:className"
        element={<StudentColumn />}
        />,
      { preloadedState: mockStore,
        initialEntries: ['/courses/Demo/test']
       },
    );

    const link = getByText('Test User');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  test('renders Status badge', () => {
    const columns = getColumns();

    const StatusColumn = () => columns[3].Cell({
      row: { values: { status: 'Active' } },
    });

    const { getByText } = renderWithProviders(
        <StatusColumn />,
      { preloadedState: mockStore },
    );

    expect(getByText('Active')).toBeInTheDocument();
  });

  test('renders Current Grade with safe value', () => {
    const columns = getColumns();

    const GradeColumn = () => columns[4].Cell({
      row: { values: { completePercentage: 25.8 } },
    });

    const { getByText } = renderWithProviders(
      <GradeColumn />,
      { preloadedState: mockStore },
    );

    expect(getByText('25%')).toBeInTheDocument();
  });

  test('renders Exam Ready ProgressSteps', () => {
    const columns = getColumns();

    const ExamColumn = () => columns[5].Cell({
      row: {
        values: {
          examReady: { status: 'NOT_STARTED' },
        },
      },
    });

    const { container } = renderWithProviders(
      <ExamColumn />,
      { preloadedState: mockStore },
    );

    expect(container.querySelector('.progress-steps')).toBeInTheDocument();
  });

  test('renders Last exam date as -- when null', () => {
    const columns = getColumns();

    const LastExamColumn = () => columns[6].Cell({
      row: {
        values: {
          examReady: { lastExamDate: null },
        },
      },
    });

    const { getByText } = renderWithProviders(
      <LastExamColumn />,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders Epp Days Left when value exists', () => {
    const columns = getColumns();

    const EppDaysColumn = () => columns[7].Cell({
      row: { values: { examReady: { eppDaysLeft: 3 } } },
    });

    const { getByText } = renderWithProviders(
      <EppDaysColumn />,
      { preloadedState: mockStore },
    );

    expect(getByText('3')).toBeInTheDocument();
  });

  test('renders Epp Days Left as -- when null', () => {
    const columns = getColumns();

    const EppDaysColumn = () => columns[7].Cell({
      row: { values: { examReady: { eppDaysLeft: null } } },
    });

    const { getByText } = renderWithProviders(
      <EppDaysColumn />,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders Actions dropdown', () => {
    const columns = getColumns();

    const ActionColumn = () => columns[8].Cell({
      row: {
        values: { classId: 'CCX1' },
        original: {
          classId: 'CCX1',
          learnerEmail: 'test@example.com',
          userId: '1',
          status: 'Active',
          courseId: 'course-v1:demo+demo1+2020',
        },
      },
    });

    const component = renderWithProviders(
      <ActionColumn />,
      { preloadedState: mockStore },
    );

    const btn = component.getByTestId('droprown-action');
    fireEvent.click(btn);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('renders Voucher option only when displayVoucherOptions = true', () => {
    const columns = getColumns({ displayVoucherOptions: true });

    const ActionColumn = () => columns[8].Cell({
      row: {
        values: { classId: 'CCX1' },
        original: {
          classId: 'CCX1',
          userId: '1',
          learnerEmail: 'testuser@example.com',
          courseId: 'course-v1:demo+demo1+2020',
          status: 'Active',
          voucherInfo: {
            computedStatus: 'assigned',
            showAssign: true,
          },
        },
      },
    });

    const component = renderWithProviders(
      <ActionColumn />,
      { preloadedState: mockStore },
    );

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('Assign a voucher')).toBeInTheDocument();
  });

  test('does NOT render Voucher option when displayVoucherOptions = false', () => {
    const columns = getColumns();

    const ActionColumn = () => columns[8].Cell({
      row: {
        values: { classId: 'CCX1' },
        original: {
          classId: 'CCX1',
          userId: '1',
          learnerEmail: 'testuser@example.com',
          courseId: 'course-v1:demo+demo1+2020',
          status: 'Active',
        },
      },
    });

    const component = renderWithProviders(
      <ActionColumn />,
      { preloadedState: mockStore },
    );

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.queryByText('Assign a voucher')).not.toBeInTheDocument();
  });
});

describe('Voucher Status column', () => {
  const getVoucherCell = () => {
    const columns = getColumns({ enableVoucherColumn: true });
    const col = columns.find(c => c.accessor === 'voucherInfo');
    return col?.Cell;
  };

  const getText = rendered => (Array.isArray(rendered.props.children)
    ? rendered.props.children[0]
    : rendered.props.children);

  test('displays "assigned" with "success" variant when computedStatus is "assigned"', () => {
    const row = {
      values: {
        voucherInfo: { computedStatus: 'assigned' },
      },
    };

    const Cell = getVoucherCell();
    const rendered = Cell({ row });

    expect(rendered.props.variant).toBe('success');
    expect(getText(rendered)).toBe('assigned');
  });

  test('displays "revoked" with "danger" variant when computedStatus is "revoked"', () => {
    const row = {
      values: {
        voucherInfo: { computedStatus: 'revoked' },
      },
    };

    const Cell = getVoucherCell();
    const rendered = Cell({ row });

    expect(rendered.props.variant).toBe('danger');
    expect(getText(rendered)).toBe('revoked');
  });

  test('displays "not assigned" and "light" variant when voucherInfo is null', () => {
    const row = {
      values: {
        voucherInfo: null,
      },
    };

    const Cell = getVoucherCell();
    const rendered = Cell({ row });

    expect(rendered.props.variant).toBe('light');
    expect(getText(rendered)).toBe('not assigned');
  });

  test('displays "not assigned" and "light" variant when voucherInfo has no computedStatus', () => {
    const row = {
      values: {
        voucherInfo: {},
      },
    };

    const Cell = getVoucherCell();
    const rendered = Cell({ row });

    expect(rendered.props.variant).toBe('light');
    expect(getText(rendered)).toBe('not assigned');
  });

  test('falls back to "light" variant when computedStatus does not match existing ones', () => {
    const row = {
      values: {
        voucherInfo: { computedStatus: 'unknown' },
      },
    };

    const Cell = getVoucherCell();
    const rendered = Cell({ row });

    expect(rendered.props.variant).toBe('light');
    expect(getText(rendered)).toBe('unknown');
  });
});
