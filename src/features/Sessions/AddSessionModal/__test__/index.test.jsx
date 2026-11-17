import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import AddSessionModal from 'features/Sessions/AddSessionModal';

describe('AddSessionModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
    sessionData: null,
    isEditing: false,
    showToast: false,
    setShowToast: jest.fn(),
    toastMessage: '',
  };

  const mockSessionData = {
    sessionId: 'session-2026-spring',
    sessionName: 'Spring 2026 Cohort',
    startDate: '2026-03-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly in creation mode', () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Add session' })).toBeInTheDocument();
    expect(screen.getByTestId('session_name_input')).toHaveValue('');
    expect(screen.getByTestId('start_date_input')).toHaveValue('');
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add session/i })).toBeInTheDocument();
  });

  test('populates fields correctly in edition mode', () => {
    renderWithProviders(
      <AddSessionModal
        {...defaultProps}
        isEditing
        sessionData={mockSessionData}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Edit session' })).toBeInTheDocument();
    expect(screen.getByTestId('session_name_input')).toHaveValue('Spring 2026 Cohort');
    expect(screen.getByTestId('start_date_input')).toHaveValue('2026-03-01');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  test('calls onSubmit with formData when creating a new session', async () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />);

    fireEvent.change(screen.getByTestId('session_name_input'), {
      target: { value: 'New Cohort 2026' },
    });
    fireEvent.change(screen.getByTestId('start_date_input'), {
      target: { value: '2026-05-01' },
    });

    const submitBtn = screen.getByRole('button', { name: /add session/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        sessionName: 'New Cohort 2026',
        startDate: '2026-05-01',
      });
    });
  });

  test('calls onSubmit without startDate when optional date is omitted', async () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />);

    fireEvent.change(screen.getByTestId('session_name_input'), {
      target: { value: 'Immediate Cohort 2026' },
    });

    const submitBtn = screen.getByRole('button', { name: /add session/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        sessionName: 'Immediate Cohort 2026',
        startDate: '',
      });
    });
  });

  test('calls onSubmit with updated formData in edition mode', async () => {
    renderWithProviders(
      <AddSessionModal
        {...defaultProps}
        isEditing
        sessionData={mockSessionData}
      />,
    );

    fireEvent.change(screen.getByTestId('session_name_input'), {
      target: { value: 'Updated Cohort Name' },
    });

    const submitBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        sessionName: 'Updated Cohort Name',
        startDate: '2026-03-01',
      });
    });
  });

  test('triggers form validation when required fields are missing', () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />);

    const submitBtn = screen.getByRole('button', { name: /add session/i });
    fireEvent.click(submitBtn);

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test('disables submit and cancel buttons while isLoading is true', () => {
    renderWithProviders(<AddSessionModal {...defaultProps} isLoading />);

    expect(screen.getByRole('button', { name: /saving\.\.\./i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  test('calls onClose when clicking Cancel button', () => {
    renderWithProviders(<AddSessionModal {...defaultProps} />);

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('displays toast message when showToast is true', () => {
    renderWithProviders(
      <AddSessionModal
        {...defaultProps}
        showToast
        toastMessage="Session created successfully."
      />,
    );

    expect(screen.getByText('Session created successfully.')).toBeInTheDocument();
  });
});
