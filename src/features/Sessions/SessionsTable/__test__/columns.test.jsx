/* eslint-disable react/prop-types */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { logError } from '@edx/frontend-platform/logging';
import { renderWithProviders } from 'test-utils';
import * as sessionsApiModule from 'features/Sessions/data/sessionsApi';
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

jest.mock('react-paragon-topaz', () => ({
  Badge: ({ children, variant }) => (
    <span data-testid="mock-badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('Sessions Table columns', () => {
  const mockDeleteSession = jest.fn();
  const mockEditSession = jest.fn();

  const mockRowData = {
    id: 'session-123',
    name: 'Spring 2026 Cohort',
    offeringId: 10,
    offeringName: 'CS Certificate',
    instructors: ['Dr. Jane Doe', 'Prof. Alan Turing'],
    classesCount: 3,
    studentsEnrolled: 22,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    hidden: false,
  };

  const preloadedState = {
    main: {
      selectedInstitution: { id: 1, name: 'Institution 1' },
    },
  };

  const createCellProps = (customData = {}) => {
    const data = { ...mockRowData, ...customData };
    return {
      row: {
        original: data,
        values: {
          name: data.name,
          offeringName: data.offeringName,
          instructors: data.instructors,
          classesCount: data.classesCount,
          studentsEnrolled: data.studentsEnrolled,
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

    return renderWithProviders(<CellComponent {...props} />, { preloadedState });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(sessionsApiModule, 'useDeleteSessionMutation').mockReturnValue([
      mockDeleteSession,
      { isLoading: false },
    ]);
    jest.spyOn(sessionsApiModule, 'useEditSessionMutation').mockReturnValue([
      mockEditSession,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Actions Column', () => {
    test('renders dropdown menu and handles "View classes" link', () => {
      renderCell('actions', createCellProps());

      const dropdownBtn = screen.getByTestId('dropdown-action');
      expect(dropdownBtn).toBeInTheDocument();
      fireEvent.click(dropdownBtn);

      const viewClassesLink = screen.getByText('View classes').closest('a');
      expect(viewClassesLink).toHaveAttribute('href', `/sessions/${mockRowData.id}`);
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

    test('toggles session visibility successfully and displays toast', async () => {
      mockEditSession.mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({}),
      });

      renderCell('actions', createCellProps({ hidden: false }));

      fireEvent.click(screen.getByTestId('dropdown-action'));
      fireEvent.click(screen.getByText('Hide session'));

      await waitFor(() => {
        expect(mockEditSession).toHaveBeenCalledWith({
          data: {
            offering_run_id: 'session-123',
            offering_id: 10,
            hidden: true,
          },
          params: {
            institution_id: 1,
          },
        });
        expect(screen.getByText('Session hidden successfully.')).toBeInTheDocument();
      });
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
        expect(mockDeleteSession).toHaveBeenCalledWith(mockRowData.id);
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
      expect(screen.getByText(mockRowData.name)).toBeInTheDocument();

      unmount();

      renderCell('Program', createCellProps());
      expect(screen.getByText(mockRowData.offeringName)).toBeInTheDocument();
    });

    test('renders Session Name as a link to the session detail view', () => {
      renderCell('Session', createCellProps());

      const link = screen.getByText(mockRowData.name).closest('a');
      expect(link).toHaveAttribute(
        'href',
        `/sessions/${encodeURIComponent(mockRowData.id)}`,
      );
    });

    test('renders fallback "-" for empty Program Name', () => {
      renderCell('Program', createCellProps({ offeringName: null }));
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    describe('Instructors Column', () => {
      test('renders comma-separated instructors when assigned', () => {
        renderCell('Instructors', createCellProps());
        expect(screen.getByText('Dr. Jane Doe, Prof. Alan Turing')).toBeInTheDocument();
      });

      test('renders "Unassigned" badge when instructors list is empty', () => {
        renderCell('Instructors', createCellProps({ instructors: [] }));

        const badge = screen.getByTestId('mock-badge');
        expect(badge).toHaveTextContent('Unassigned');
        expect(badge).toHaveAttribute('data-variant', 'danger');
      });
    });

    describe('Classes & Students Columns', () => {
      test('renders numeric values for Classes and Students Enrolled', () => {
        const { unmount } = renderCell('Classes', createCellProps());
        expect(screen.getByText('3')).toBeInTheDocument();
        unmount();

        renderCell('Students Enrolled', createCellProps());
        expect(screen.getByText('22')).toBeInTheDocument();
      });

      test('renders fallback 0 when classesCount or studentsEnrolled is null', () => {
        const { unmount } = renderCell('Classes', createCellProps({ classesCount: null }));
        expect(screen.getByText('0')).toBeInTheDocument();
        unmount();

        renderCell('Students Enrolled', createCellProps({ studentsEnrolled: null }));
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
