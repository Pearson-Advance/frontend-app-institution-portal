/* eslint-disable react/prop-types, func-names */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';

import EnrollStudentModal from 'features/Sessions/EnrollStudentModal';
import { handleEnrollments, getMessages } from 'features/Students/data/api';

jest.mock('features/Students/data/api', () => ({
  handleEnrollments: jest.fn(),
  getMessages: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Common/EnrollModal', () => function ({
  isOpen,
  onClose,
  subtitleLabel,
  subtitleValue,
  onSubmit,
  isLoading,
  showToast,
  setShowToast,
  toastMessage,
}) {
  return isOpen ? (
    <div data-testid="enroll-base-modal">
      <span>{subtitleLabel}: {subtitleValue}</span>
      <span data-testid="is-loading">{isLoading ? 'loading' : 'idle'}</span>

      {showToast && (
        <div data-testid="toast-container">
          <span>{toastMessage}</span>
          <button onClick={() => setShowToast(false)} type="button">
            Close Toast
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} data-testid="enroll-form">
        <input name="studentEmail" defaultValue="student@example.com" />
        <button type="submit">Submit Form</button>
      </form>

      <button onClick={onClose} type="button">
        Cancel Modal
      </button>
    </div>
  ) : null;
});

describe('EnrollStudentModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    sessionId: 'session-2026-101',
    sessionName: 'Cohort Fall 2026',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders EnrollModal with correct subtitle props when open', () => {
    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    expect(screen.getByTestId('enroll-base-modal')).toBeInTheDocument();
    expect(screen.getByText('Session: Cohort Fall 2026')).toBeInTheDocument();
  });

  it('handles successful enrollment with valid emails', async () => {
    handleEnrollments.mockResolvedValueOnce({
      data: {
        results: [
          { invalidIdentifier: false, identifier: 'student1@example.com' },
          { invalidIdentifier: false, identifier: 'student2@example.com' },
        ],
      },
    });

    getMessages.mockResolvedValueOnce({
      data: { results: [] },
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const form = screen.getByTestId('enroll-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleEnrollments).toHaveBeenCalledTimes(1);
      expect(getMessages).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('handles enrollment response containing invalid emails', async () => {
    handleEnrollments.mockResolvedValueOnce({
      data: {
        results: [
          { invalidIdentifier: true, identifier: 'invalid-email' },
          { invalidIdentifier: false, identifier: 'valid@example.com' },
        ],
      },
    });

    getMessages.mockResolvedValueOnce({
      data: { results: [] },
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const form = screen.getByTestId('enroll-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleEnrollments).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('handles server-side warning/error returned in a 200 response via getMessages', async () => {
    handleEnrollments.mockResolvedValueOnce({
      data: { results: [] },
    });

    getMessages.mockResolvedValueOnce({
      data: {
        results: [
          {
            tags: 'error',
            message: encodeURIComponent('User is already enrolled'),
          },
        ],
      },
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const form = screen.getByTestId('enroll-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(getMessages).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('catches submission exceptions and shows generic error message', async () => {
    handleEnrollments.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const form = screen.getByTestId('enroll-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
      expect(
        screen.getByText('An error occurred while attempting to enroll the student.'),
      ).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  it('calls onClose when clicking the Cancel button', () => {
    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const cancelBtn = screen.getByRole('button', { name: /cancel modal/i });
    fireEvent.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
