/* eslint-disable react/prop-types */
import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { logError } from '@edx/frontend-platform/logging';
import { useDeleteSessionMutation } from 'features/Sessions/data/sessionsApi';
import { columns } from 'features/Sessions/SessionsTable/columns';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('helpers', () => ({
  formatUTCDate: jest.fn((date) => `formatted-${date}`),
}));

jest.mock('features/Main/LinkWithQuery', () => function MockLinkWithQuery({ to, children, className }) {
  return <a href={to} className={className}>{children}</a>;
});

jest.mock('features/Common/DeleteModal', () => function MockDeleteModal({
  isOpen,
  onClose,
  handleDelete,
  isLoading,
  title,
  textModal,
}) {
  return isOpen ? (
    <div data-testid="mock-delete-modal">
      <span>{title}</span>
      <span>{textModal}</span>
      <span data-testid="modal-loading">{String(isLoading)}</span>
      <button onClick={handleDelete} type="button">Confirm Delete</button>
      <button onClick={onClose} type="button">Cancel Delete</button>
    </div>
  ) : null;
});

jest.mock('features/Sessions/data/sessionsApi', () => ({
  useDeleteSessionMutation: jest.fn(),
}));

jest.mock('react-paragon-topaz', () => ({
  Badge: ({ children, variant }) => (
    <span data-testid="mock-badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('Sessions Table columns', () => {
  const mockDeleteSession = jest.fn();

  const mockRowData = {
    sessionId: 'session-123',
    sessionName: 'Spring 2026 Cohort',
    programName: 'CS Certificate',
    missingClassesForInstructor: 0,
    minStudentsAllowed: 10,
    maxStudents: 30,
    numberOfStudents: 22,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    hidden: false,
  };

  const createCellProps = (customData = {}) => {
    const data = { ...mockRowData, ...customData };
    return {
      row: {
        original: data,
        values: {
          sessionName: data.sessionName,
          programName: data.programName,
          missingClassesForInstructor: data.missingClassesForInstructor,
          minStudentsAllowed: data.minStudentsAllowed,
          maxStudents: data.maxStudents,
          numberOfStudents: data.numberOfStudents,
          startDate: data.startDate,
          endDate: data.endDate,
          hidden: data.hidden,
        },
      },
    };
  };

  const renderCell = (columnHeaderOrAccessor, props) => {
    const column = columns.find(
      (col) => col.Header === columnHeaderOrAccessor || col.accessor === columnHeaderOrAccessor,
    );
    const CellComponent = column.Cell;

    return render(
      <IntlProvider locale="en" messages={{}}>
        <MemoryRouter>
          <CellComponent {...props} />
        </MemoryRouter>
      </IntlProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDeleteSessionMutation.mockReturnValue([
      mockDeleteSession,
      { isLoading: false },
    ]);
  });

  describe('Actions Column', () => {
    test('renders dropdown menu and handles "View classes" link', () => {
      renderCell('actions', createCellProps());

      const dropdownBtn = screen.getByTestId('dropdown-action');
      expect(dropdownBtn).toBeInTheDocument();
      fireEvent.click(dropdownBtn);

      const viewClassesLink = screen.getByText('View classes').closest('a');
      expect(viewClassesLink).toHaveAttribute('href', `/sessions/${mockRowData.sessionId}`);
    });

    test('renders "Hide session" when hidden is false, and "Show session" when hidden is true', () => {
      const { unmount } = renderCell('actions', createCellProps({ hidden: false }));
      fireEvent.click(screen.getByTestId('dropdown-action'));
      expect(screen.getByText('Hide session')).toBeInTheDocument();

      unmount();

      renderCell('actions', createCellProps({ hidden: true }));
      fireEvent.click(screen.getByTestId('dropdown-action'));
      expect(screen.getByText('Show session')).toBeInTheDocument();
    });

    test('opens and closes the DeleteModal', () => {
      renderCell('actions', createCellProps());

      expect(screen.queryByTestId('mock-delete-modal')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('dropdown-action'));
      fireEvent.click(screen.getByText('Delete session'));

      expect(screen.getByTestId('mock-delete-modal')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel Delete'));
      expect(screen.queryByTestId('mock-delete-modal')).not.toBeInTheDocument();
    });

    test('deletes session successfully and displays success toast', async () => {
      mockDeleteSession.mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({}),
      });

      renderCell('actions', createCellProps());

      fireEvent.click(screen.getByTestId('dropdown-action'));
      fireEvent.click(screen.getByText('Delete session'));

      fireEvent.click(screen.getByText('Confirm Delete'));

      await waitFor(() => {
        expect(mockDeleteSession).toHaveBeenCalledWith(mockRowData.sessionId);
        expect(screen.getByText('Session deleted successfully.')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('mock-delete-modal')).not.toBeInTheDocument();
    });

    test('handles delete failure, logs error, and shows failure toast', async () => {
      const errorObj = { message: 'Network Error' };
      mockDeleteSession.mockReturnValue({
        unwrap: jest.fn().mockRejectedValue(errorObj),
      });

      renderCell('actions', createCellProps());

      fireEvent.click(screen.getByTestId('dropdown-action'));
      fireEvent.click(screen.getByText('Delete session'));

      fireEvent.click(screen.getByText('Confirm Delete'));

      await waitFor(() => {
        expect(logError).toHaveBeenCalledWith(errorObj);
        expect(screen.getByText('Network Error')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('mock-delete-modal')).not.toBeInTheDocument();
    });
  });

  describe('Data Columns', () => {
    test('renders Session Name and Program Name correctly', () => {
      const { unmount } = renderCell('Session', createCellProps());
      expect(screen.getByText(mockRowData.sessionName)).toBeInTheDocument();

      unmount();

      renderCell('Program', createCellProps());
      expect(screen.getByText(mockRowData.programName)).toBeInTheDocument();
    });

    test('renders fallback "-" for empty Program Name', () => {
      renderCell('Program', createCellProps({ programName: null }));
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    describe('Instructor Column', () => {
      test('renders "Ready" badge when missingClassesForInstructor is 0', () => {
        renderCell('Instructor', createCellProps({ missingClassesForInstructor: 0 }));

        const badge = screen.getByTestId('mock-badge');
        expect(badge).toHaveTextContent('Ready');
        expect(badge).toHaveAttribute('data-variant', 'success');
      });

      test('renders "Missing (N)" badge when missingClassesForInstructor is greater than 0', () => {
        renderCell('Instructor', createCellProps({ missingClassesForInstructor: 3 }));

        const badge = screen.getByTestId('mock-badge');
        expect(badge).toHaveTextContent('Missing (3)');
        expect(badge).toHaveAttribute('data-variant', 'danger');
      });
    });

    describe('Capacity & Students Columns', () => {
      test('renders numeric values for Min, Max, and Students Enrolled', () => {
        const { unmount: unmountMin } = renderCell('Min', createCellProps());
        expect(screen.getByText('10')).toBeInTheDocument();
        unmountMin();

        const { unmount: unmountMax } = renderCell('Max', createCellProps());
        expect(screen.getByText('30')).toBeInTheDocument();
        unmountMax();

        renderCell('Students Enrolled', createCellProps());
        expect(screen.getByText('22')).toBeInTheDocument();
      });

      test('renders fallback values when Min is null or undefined', () => {
        renderCell('Min', createCellProps({ minStudentsAllowed: null }));
        expect(screen.getByText('-')).toBeInTheDocument();
      });

      test('renders fallback values when Max is null or undefined', () => {
        renderCell('Max', createCellProps({ maxStudents: null }));
        expect(screen.getByText('-')).toBeInTheDocument();
      });

      test('renders fallback 0 when numberOfStudents is null or undefined', () => {
        renderCell('Students Enrolled', createCellProps({ numberOfStudents: null }));
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    describe('Dates Columns', () => {
      test('renders formatted Start Date and End Date', () => {
        const { unmount } = renderCell('Start Date', createCellProps());
        expect(screen.getByText(`formatted-${mockRowData.startDate}`)).toBeInTheDocument();
        unmount();

        renderCell('End Date', createCellProps());
        expect(screen.getByText(`formatted-${mockRowData.endDate}`)).toBeInTheDocument();
      });

      test('renders fallback "-" when Start Date is null or undefined', () => {
        renderCell('Start Date', createCellProps({ startDate: null }));
        expect(screen.getByText('-')).toBeInTheDocument();
      });

      test('renders fallback "-" when End Date is null or undefined', () => {
        renderCell('End Date', createCellProps({ endDate: null }));
        expect(screen.getByText('-')).toBeInTheDocument();
      });
    });

    describe('Status Column', () => {
      test('renders "Visible" when hidden is false', () => {
        renderCell('Status', createCellProps({ hidden: false }));
        expect(screen.getByText('Visible')).toBeInTheDocument();
      });

      test('renders "Hidden" when hidden is true', () => {
        renderCell('Status', createCellProps({ hidden: true }));
        expect(screen.getByText('Hidden')).toBeInTheDocument();
      });
    });
  });
});
