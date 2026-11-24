/* eslint-disable react/prop-types */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { logError } from '@edx/frontend-platform/logging';
import { renderWithProviders } from 'test-utils';

import EnrollStudentModal from 'features/Sessions/EnrollStudentModal';
import * as sessionsApiModule from 'features/Sessions/data/sessionsApi';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('EnrollStudentModal Component', () => {
  const mockEnrollStudentInSession = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    sessionId: 'session-2026-101',
    sessionName: 'Cohort Fall 2026',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(sessionsApiModule, 'useEnrollStudentInSessionMutation').mockReturnValue([
      mockEnrollStudentInSession,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders modal header, session subtitle, textarea, and buttons when open', () => {
    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    expect(screen.getByRole('dialog', { name: /invite student to enroll/i })).toBeInTheDocument();
    expect(screen.getByText(/session: cohort fall 2026/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send invite/i })).toBeInTheDocument();
  });

  test('shows spinner while mutation is loading', () => {
    jest.spyOn(sessionsApiModule, 'useEnrollStudentInSessionMutation').mockReturnValue([
      mockEnrollStudentInSession,
      { isLoading: true },
    ]);

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.queryByLabelText(/email or username/i)).not.toBeInTheDocument();
  });

  test('handles full successful enrollment, shows toast, and closes modal', async () => {
    mockEnrollStudentInSession.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        results: [
          { identifier: 'student1@example.com', status: 'completed', error: null },
          { identifier: 'student2@example.com', status: 'completed', error: null },
        ],
      }),
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/email or username/i);
    fireEvent.change(textarea, {
      target: { value: 'student1@example.com\nstudent2@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      expect(mockEnrollStudentInSession).toHaveBeenCalledWith({
        offeringRunId: 'session-2026-101',
        data: { identifiers: 'student1@example.com, student2@example.com' },
      });
      expect(screen.getByTestId('toast-message')).toHaveTextContent(
        'Successfully enrolled: student1@example.com, student2@example.com.',
      );
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('groups partial failure/rejected results below textarea, keeps failed identifiers, and switches button to Retry', async () => {
    mockEnrollStudentInSession.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        results: [
          { identifier: 'ok@example.com', status: 'completed', error: null },
          {
            identifier: 'fail1@example.com',
            status: 'failed',
            error: 'The license reached the maximum limit of purchased seats.',
          },
          {
            identifier: 'fail2@example.com',
            status: 'failed',
            error: 'The license reached the maximum limit of purchased seats.',
          },
          {
            identifier: 'unknown@example',
            status: 'rejected',
            error: 'No registered user matches this username or email.',
          },
        ],
      }),
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/email or username/i);
    fireEvent.change(textarea, {
      target: { value: 'ok@example.com, fail1@example.com, fail2@example.com, unknown@example' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      const feedback = screen.getByTestId('enrollment-results-feedback');
      expect(feedback).toHaveTextContent('Successfully enrolled (1): ok@example.com');
      expect(feedback).toHaveTextContent(
        'The license reached the maximum limit of purchased seats. (2): fail1@example.com, fail2@example.com',
      );
      expect(feedback).toHaveTextContent(
        'No registered user matches this username or email. (1): unknown@example',
      );
    });

    expect(defaultProps.onClose).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('fail1@example.com, fail2@example.com, unknown@example');
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  test('handles API error, shows error toast, preserves input, and switches button to Retry', async () => {
    const apiError = {
      status: 400,
      data: { detail: 'The Offering Run is not fully set up yet.' },
    };

    mockEnrollStudentInSession.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(apiError),
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/email or username/i);
    fireEvent.change(textarea, { target: { value: 'learner1' } });

    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      expect(logError).toHaveBeenCalledWith(apiError);
      expect(screen.getByTestId('toast-message')).toHaveTextContent(
        'The Offering Run is not fully set up yet.',
      );
    });

    expect(defaultProps.onClose).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('learner1');
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  test('calls onClose when clicking the Cancel button', () => {
    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
