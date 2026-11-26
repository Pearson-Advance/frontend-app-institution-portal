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

  test('keeps the form mounted, disables inputs and shows spinner in the button while loading', () => {
    jest.spyOn(sessionsApiModule, 'useEnrollStudentInSessionMutation').mockReturnValue([
      mockEnrollStudentInSession,
      { isLoading: true },
    ]);

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/email or username/i);
    const submitButton = screen.getByRole('button', { name: /send invite/i });

    expect(textarea).toBeInTheDocument();
    expect(textarea).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(submitButton).toContainElement(screen.getByTestId('enroll-submit-spinner'));
  });

  test('does not call the mutation when input only contains whitespace or commas', async () => {
    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/email or username/i);
    fireEvent.change(textarea, { target: { value: ' , \n ' } });
    fireEvent.submit(textarea.closest('form'));

    await waitFor(() => {
      expect(mockEnrollStudentInSession).not.toHaveBeenCalled();
    });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
    expect(screen.queryByTestId('enrollment-results-feedback')).not.toBeInTheDocument();
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

  test('treats statuses other than completed as errors consistently (no success toast)', async () => {
    mockEnrollStudentInSession.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        results: [
          { identifier: 'ok@example.com', status: 'completed', error: null },
          { identifier: 'waiting@example.com', status: 'pending', error: null },
        ],
      }),
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/email or username/i);
    fireEvent.change(textarea, { target: { value: 'ok@example.com, waiting@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      const feedback = screen.getByTestId('enrollment-results-feedback');
      expect(feedback).toHaveTextContent('Successfully enrolled (1): ok@example.com');
      expect(feedback).toHaveTextContent('Enrollment pending. (1): waiting@example.com');
    });

    expect(screen.queryByTestId('toast-message')).not.toBeInTheDocument();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('waiting@example.com');
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  test('merges results across retries so earlier successes stay in the feedback', async () => {
    mockEnrollStudentInSession
      .mockReturnValueOnce({
        unwrap: jest.fn().mockResolvedValue({
          results: [
            { identifier: 'ok@example.com', status: 'completed', error: null },
            { identifier: 'a@example.com', status: 'failed', error: 'No seats.' },
            { identifier: 'b@example.com', status: 'failed', error: 'No seats.' },
          ],
        }),
      })
      .mockReturnValueOnce({
        unwrap: jest.fn().mockResolvedValue({
          results: [
            { identifier: 'a@example.com', status: 'completed', error: null },
            { identifier: 'b@example.com', status: 'rejected', error: 'Unknown user.' },
          ],
        }),
      });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/email or username/i);
    fireEvent.change(textarea, { target: { value: 'ok@example.com, a@example.com, b@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
    expect(textarea).toHaveValue('a@example.com, b@example.com');

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(mockEnrollStudentInSession).toHaveBeenLastCalledWith({
        offeringRunId: 'session-2026-101',
        data: { identifiers: 'a@example.com, b@example.com' },
      });
      const feedback = screen.getByTestId('enrollment-results-feedback');
      expect(feedback).toHaveTextContent('Successfully enrolled (2): ok@example.com, a@example.com');
      expect(feedback).toHaveTextContent('Unknown user. (1): b@example.com');
      expect(feedback).not.toHaveTextContent('No seats.');
    });
    expect(textarea).toHaveValue('b@example.com');
  });

  test.each([
    ['non_field_errors', { non_field_errors: ['Session is closed.'] }, 'Session is closed.'],
    ['field-level errors', { identifiers: ['This field is required.'] }, 'identifiers: This field is required.'],
    ['plain-string data', 'Internal server error', 'Internal server error'],
    ['no usable data (generic fallback)', undefined, 'An error occurred while attempting to enroll the student.'],
  ])('shows the API error message for %s', async (_label, data, expectedMessage) => {
    mockEnrollStudentInSession.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ status: 400, data }),
    });

    renderWithProviders(<EnrollStudentModal {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/email or username/i), { target: { value: 'learner1' } });
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      expect(screen.getByTestId('toast-message')).toHaveTextContent(expectedMessage);
    });
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
