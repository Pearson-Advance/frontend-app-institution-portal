import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import * as sessionsApiModule from 'features/Sessions/data/sessionsApi';
import AddSessionModal from 'features/Sessions/AddSessionModal';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('AddSessionModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    programInfo: {
      programId: 'program-101',
      programTitle: 'Computer Science Master',
    },
    sessionData: null,
    isEditing: false,
  };

  const mockSessionData = {
    sessionId: 'session-2026-spring',
    sessionName: 'Spring 2026 Cohort',
    startDate: '2026-03-01T00:00:00Z',
    endDate: '2026-06-30T00:00:00Z',
  };

  const preloadedState = {
    main: {
      selectedInstitution: { id: 10, name: 'Main Institution' },
    },
  };

  const mockAddSession = jest.fn();
  const mockEditSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(sessionsApiModule, 'useAddSessionMutation').mockReturnValue([
      mockAddSession,
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

  it('renders correctly in creation mode', () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />, { preloadedState });

    expect(screen.getByRole('heading', { name: 'Add session' })).toBeInTheDocument();
    expect(screen.getByTestId('session_name_input')).toHaveValue('');
    expect(screen.getByTestId('start_date_input')).toHaveValue('');
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add session/i })).toBeInTheDocument();
  });

  it('populates fields correctly in edition mode', () => {
    renderWithProviders(
      <AddSessionModal
        {...defaultProps}
        isEditing
        sessionData={mockSessionData}
      />,
      { preloadedState },
    );

    expect(screen.getByRole('heading', { name: 'Edit session' })).toBeInTheDocument();
    expect(screen.getByTestId('session_name_input')).toHaveValue('Spring 2026 Cohort');
    expect(screen.getByTestId('start_date_input')).toHaveValue('2026-03-01');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('submits form to create a new session successfully', async () => {
    mockAddSession.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });

    renderWithProviders(<AddSessionModal {...defaultProps} />, { preloadedState });

    fireEvent.change(screen.getByTestId('session_name_input'), {
      target: { value: 'New Cohort 2026' },
    });
    fireEvent.change(screen.getByTestId('start_date_input'), {
      target: { value: '2026-05-01' },
    });

    const submitBtn = screen.getByRole('button', { name: /add session/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockAddSession).toHaveBeenCalledWith({
        sessionName: 'New Cohort 2026',
        startDate: '2026-05-01',
        endDate: '',
        institutionId: 10,
        programId: 'program-101',
      });
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('submits form to edit an existing session successfully', async () => {
    mockEditSession.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });

    renderWithProviders(
      <AddSessionModal
        {...defaultProps}
        isEditing
        sessionData={mockSessionData}
      />,
      { preloadedState },
    );

    fireEvent.change(screen.getByTestId('session_name_input'), {
      target: { value: 'Updated Cohort Name' },
    });

    const submitBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockEditSession).toHaveBeenCalledWith({
        sessionId: 'session-2026-spring',
        sessionName: 'Updated Cohort Name',
        startDate: '2026-03-01',
        endDate: '2026-06-30',
        institutionId: 10,
        programId: 'program-101',
      });
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('triggers form validation when required fields are missing', () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />, { preloadedState });

    const submitBtn = screen.getByRole('button', { name: /add session/i });
    fireEvent.click(submitBtn);

    expect(mockAddSession).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('handles API submission errors and calls logError', async () => {
    const mockError = new Error('API Error');
    mockAddSession.mockReturnValue({ unwrap: jest.fn().mockRejectedValue(mockError) });

    renderWithProviders(<AddSessionModal {...defaultProps} />, { preloadedState });

    fireEvent.change(screen.getByTestId('session_name_input'), {
      target: { value: 'New Cohort 2026' },
    });
    fireEvent.change(screen.getByTestId('start_date_input'), {
      target: { value: '2026-05-01' },
    });

    const submitBtn = screen.getByRole('button', { name: /add session/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockAddSession).toHaveBeenCalled();
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  it('disables submit and cancel buttons while loading', () => {
    jest.spyOn(sessionsApiModule, 'useAddSessionMutation').mockReturnValue([
      mockAddSession,
      { isLoading: true },
    ]);

    renderWithProviders(<AddSessionModal {...defaultProps} />, { preloadedState });

    expect(screen.getByRole('button', { name: /saving\.\.\./i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('calls onClose when clicking Cancel button', () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />, { preloadedState });

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
