import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import EnrollModal from 'features/Common/EnrollModal';

describe('EnrollModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    subtitleLabel: 'Session',
    subtitleValue: 'Spring 2026 Cohort',
    onSubmit: jest.fn(),
    isLoading: false,
    showToast: false,
    setShowToast: jest.fn(),
    toastMessage: '',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal header, title, subtitle, and form when open', () => {
    renderWithProviders(<EnrollModal {...defaultProps} />);

    expect(screen.getByText('Invite student to enroll')).toBeInTheDocument();
    expect(screen.getByText('Session: Spring 2026 Cohort')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter email of the student to enroll'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send invite/i })).toBeInTheDocument();
  });

  it('displays the spinner and hides the form when isLoading is true', () => {
    renderWithProviders(<EnrollModal {...defaultProps} isLoading />);

    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Enter email of the student to enroll'),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /send invite/i })).not.toBeInTheDocument();
  });

  it('renders and shows the Toast when showToast is true', () => {
    const toastProps = {
      ...defaultProps,
      showToast: true,
      toastMessage: 'Student enrolled successfully!',
    };

    renderWithProviders(<EnrollModal {...toastProps} />);

    expect(screen.getByTestId('toast-message')).toBeInTheDocument();
    expect(screen.getByText('Student enrolled successfully!')).toBeInTheDocument();
  });

  it('calls setShowToast(false) when closing the Toast', () => {
    const setShowToastMock = jest.fn();
    const toastProps = {
      ...defaultProps,
      showToast: true,
      toastMessage: 'Error enrolling student',
      setShowToast: setShowToastMock,
    };

    renderWithProviders(<EnrollModal {...toastProps} />);

    const closeToastButton = screen.getByTestId('toast-message').querySelector('button');
    if (closeToastButton) {
      fireEvent.click(closeToastButton);
      expect(setShowToastMock).toHaveBeenCalledWith(false);
    }
  });

  it('triggers onSubmit when the form is submitted', () => {
    const onSubmitMock = jest.fn((e) => e.preventDefault());
    renderWithProviders(<EnrollModal {...defaultProps} onSubmit={onSubmitMock} />);

    const textarea = screen.getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(textarea, { target: { value: 'student@example.com' } });

    const submitButton = screen.getByRole('button', { name: /send invite/i });
    fireEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the Cancel button', () => {
    const onCloseMock = jest.fn();
    renderWithProviders(<EnrollModal {...defaultProps} onClose={onCloseMock} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
