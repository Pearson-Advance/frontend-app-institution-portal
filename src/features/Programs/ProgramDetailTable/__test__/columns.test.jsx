/* eslint-disable react/prop-types, func-names */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import * as sessionsApiModule from 'features/Sessions/data/sessionsApi';
import { columns } from '../columns';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ programId: 'program-123' }),
}));

jest.mock('features/Sessions/AddSessionModal', () => function ({ isOpen, onClose, sessionData }) {
  return isOpen ? (
    <div data-testid="add-session-modal">
      <span>Edit Modal for {sessionData?.sessionName}</span>
      <button onClick={onClose} type="button">Close Edit Modal</button>
    </div>
  ) : null;
});

jest.mock('features/Sessions/EnrollStudentModal', () => function ({ isOpen, onClose, sessionName }) {
  return isOpen ? (
    <div data-testid="enroll-student-modal">
      <span>Enroll Modal for {sessionName}</span>
      <button onClick={onClose} type="button">Close Enroll Modal</button>
    </div>
  ) : null;
});

jest.mock('features/Common/DeleteModal', () => function ({
  isOpen,
  onClose,
  handleDelete,
  isLoading,
}) {
  return isOpen ? (
    <div data-testid="delete-modal">
      <span>Delete Modal</span>
      <button onClick={handleDelete} disabled={isLoading} type="button">Confirm Delete</button>
      <button onClick={onClose} type="button">Cancel Delete</button>
    </div>
  ) : null;
});

jest.mock('features/Main/LinkWithQuery', () => function ({ to, children, className }) {
  return (
    <a href={to} className={className} data-testid="link-with-query">
      {children}
    </a>
  );
});

jest.mock('helpers', () => ({
  formatUTCDate: jest.fn((date) => (date ? '03/01/26' : '-')),
  formatInstructorsWithStatus: jest.fn((instructors) => (
    instructors && instructors.length > 0
      ? instructors.map((i) => i.name)
      : null
  )),
}));

describe('Sessions Table Columns Configuration', () => {
  const mockRowData = {
    original: {
      sessionId: 'session-2026-spring',
      sessionName: 'Spring 2026 Cohort',
      startDate: '2026-03-01T00:00:00Z',
      endDate: '2026-06-30T00:00:00Z',
      numberOfStudents: 22,
      instructorsWithStatus: [
        { name: 'Dr. Jane Doe', status: 'assigned' },
        { name: 'Prof. Alan Turing', status: 'assigned' },
      ],
    },
    values: {
      sessionName: 'Spring 2026 Cohort',
      numberOfStudents: 22,
      startDate: '2026-03-01T00:00:00Z',
      endDate: '2026-06-30T00:00:00Z',
    },
  };

  const mockDeleteSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(sessionsApiModule, 'useDeleteSessionMutation').mockReturnValue([
      mockDeleteSession,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Session Name cell with LinkWithQuery', () => {
    const sessionNameColumn = columns.find((col) => col.accessor === 'sessionName');
    const CellComponent = sessionNameColumn.Cell;

    renderWithProviders(<CellComponent row={mockRowData} />);

    const linkElement = screen.getByTestId('link-with-query');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveTextContent('Spring 2026 Cohort');
    expect(linkElement).toHaveAttribute('href', '/sessions/session-2026-spring?programId=program-123');
  });

  it('renders Instructors list when instructors exist', () => {
    const instructorColumn = columns.find((col) => col.accessor === 'instructors');
    const CellComponent = instructorColumn.Cell;

    renderWithProviders(<CellComponent row={mockRowData} />);

    expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Prof. Alan Turing')).toBeInTheDocument();
  });

  it('renders "Unassigned" badge in Instructors cell when no instructors are assigned', () => {
    const instructorColumn = columns.find((col) => col.accessor === 'instructors');
    const CellComponent = instructorColumn.Cell;

    const rowWithoutInstructors = {
      ...mockRowData,
      original: { ...mockRowData.original, instructorsWithStatus: [] },
    };

    renderWithProviders(<CellComponent row={rowWithoutInstructors} />);

    const unassignedBadge = screen.getByText('Unassigned');
    expect(unassignedBadge).toBeInTheDocument();
    expect(unassignedBadge).toHaveClass('text-danger');
  });

  it('renders Students Enrolled count', () => {
    const studentsColumn = columns.find((col) => col.accessor === 'numberOfStudents');
    const CellComponent = studentsColumn.Cell;

    renderWithProviders(<CellComponent row={mockRowData} />);

    expect(screen.getByText('22')).toBeInTheDocument();
  });

  it('renders formatted Start Date and End Date', () => {
    const startDateColumn = columns.find((col) => col.accessor === 'startDate');
    const endDateColumn = columns.find((col) => col.accessor === 'endDate');

    const StartCell = startDateColumn.Cell;
    const EndCell = endDateColumn.Cell;

    renderWithProviders(<StartCell row={mockRowData} />);
    renderWithProviders(<EndCell row={mockRowData} />);

    expect(screen.getAllByText('03/01/26')).toHaveLength(2);
  });

  it('opens and closes AddSessionModal from action dropdown', async () => {
    const actionsColumn = columns.find((col) => col.accessor === 'actions');
    const ActionsCell = actionsColumn.Cell;

    renderWithProviders(<ActionsCell row={mockRowData} />);

    const dropdownToggle = screen.getByTestId('dropdown-action');
    fireEvent.click(dropdownToggle);

    const editOption = screen.getByText('Edit session');
    fireEvent.click(editOption);

    expect(screen.getByTestId('add-session-modal')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close edit modal/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('add-session-modal')).not.toBeInTheDocument();
  });

  it('opens and closes EnrollStudentModal from action dropdown', async () => {
    const actionsColumn = columns.find((col) => col.accessor === 'actions');
    const ActionsCell = actionsColumn.Cell;

    renderWithProviders(<ActionsCell row={mockRowData} />);

    const dropdownToggle = screen.getByTestId('dropdown-action');
    fireEvent.click(dropdownToggle);

    const enrollOption = screen.getByText('Enroll student');
    fireEvent.click(enrollOption);

    expect(screen.getByTestId('enroll-student-modal')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close enroll modal/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('enroll-student-modal')).not.toBeInTheDocument();
  });

  it('handles successful session deletion and shows success Toast', async () => {
    mockDeleteSession.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });

    const actionsColumn = columns.find((col) => col.accessor === 'actions');
    const ActionsCell = actionsColumn.Cell;

    renderWithProviders(<ActionsCell row={mockRowData} />);

    const dropdownToggle = screen.getByTestId('dropdown-action');
    fireEvent.click(dropdownToggle);

    const deleteOption = screen.getByText('Delete session');
    fireEvent.click(deleteOption);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    const confirmDeleteBtn = screen.getByRole('button', { name: /confirm delete/i });
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(mockDeleteSession).toHaveBeenCalledWith('session-2026-spring');
      expect(screen.getByText('Session deleted successfully!')).toBeInTheDocument();
    });
  });

  it('handles session deletion failure and shows error Toast', async () => {
    const mockError = { message: 'Failed to delete session due to network error' };
    mockDeleteSession.mockReturnValue({ unwrap: jest.fn().mockRejectedValue(mockError) });

    const actionsColumn = columns.find((col) => col.accessor === 'actions');
    const ActionsCell = actionsColumn.Cell;

    renderWithProviders(<ActionsCell row={mockRowData} />);

    const dropdownToggle = screen.getByTestId('dropdown-action');
    fireEvent.click(dropdownToggle);

    const deleteOption = screen.getByText('Delete session');
    fireEvent.click(deleteOption);

    const confirmDeleteBtn = screen.getByRole('button', { name: /confirm delete/i });
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(mockDeleteSession).toHaveBeenCalledWith('session-2026-spring');
      expect(screen.getByText('Failed to delete session due to network error')).toBeInTheDocument();
    });
  });
});
