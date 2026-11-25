import {
  ENROLLMENT_STATUS,
  DEFAULT_ENROLLMENT_ERROR,
  isEnrollmentSuccessful,
  parseIdentifiers,
  mergeEnrollmentResults,
  groupEnrollmentResults,
  extractApiErrorMessage,
} from 'features/Sessions/data/utils';

describe('Sessions data utils', () => {
  describe('isEnrollmentSuccessful', () => {
    test('treats only completed as a success', () => {
      expect(isEnrollmentSuccessful(ENROLLMENT_STATUS.COMPLETED)).toBe(true);
    });

    test.each([
      ENROLLMENT_STATUS.FAILED,
      ENROLLMENT_STATUS.REJECTED,
      'pending',
      'skipped',
      'already_enrolled',
      undefined,
    ])('treats "%s" as not successful', (status) => {
      expect(isEnrollmentSuccessful(status)).toBe(false);
    });
  });

  describe('parseIdentifiers', () => {
    test('splits by commas and newlines, trimming entries', () => {
      expect(parseIdentifiers(' a@example.com ,b\n  c \n\n,d ')).toEqual([
        'a@example.com', 'b', 'c', 'd',
      ]);
    });

    test('returns an empty list for whitespace/commas only', () => {
      expect(parseIdentifiers(' , \n ')).toEqual([]);
      expect(parseIdentifiers('')).toEqual([]);
      expect(parseIdentifiers()).toEqual([]);
    });
  });

  describe('mergeEnrollmentResults', () => {
    test('keeps previous results and lets the latest one win on conflict', () => {
      const previous = [
        { identifier: 'ok@example.com', status: 'completed' },
        { identifier: 'retry@example.com', status: 'failed', error: 'No seats.' },
      ];
      const latest = [
        { identifier: 'retry@example.com', status: 'completed' },
        { identifier: 'new@example.com', status: 'rejected', error: 'Unknown user.' },
      ];

      expect(mergeEnrollmentResults(previous, latest)).toEqual([
        { identifier: 'ok@example.com', status: 'completed' },
        { identifier: 'retry@example.com', status: 'completed' },
        { identifier: 'new@example.com', status: 'rejected', error: 'Unknown user.' },
      ]);
    });

    test('handles empty inputs', () => {
      expect(mergeEnrollmentResults()).toEqual([]);
      expect(mergeEnrollmentResults([], [{ identifier: 'a', status: 'completed' }]))
        .toEqual([{ identifier: 'a', status: 'completed' }]);
    });
  });

  describe('groupEnrollmentResults', () => {
    test('returns empty groups for no results', () => {
      expect(groupEnrollmentResults([])).toEqual({ completed: [], errorGroups: [] });
    });

    test('groups completed identifiers and errors by message', () => {
      const results = [
        { identifier: 'ok@example.com', status: 'completed', error: null },
        { identifier: 'f1', status: 'failed', error: 'No seats.' },
        { identifier: 'f2', status: 'failed', error: 'No seats.' },
        { identifier: 'r1', status: 'rejected', error: 'Unknown user.' },
      ];

      expect(groupEnrollmentResults(results)).toEqual({
        completed: ['ok@example.com'],
        errorGroups: [
          { error: 'No seats.', identifiers: ['f1', 'f2'] },
          { error: 'Unknown user.', identifiers: ['r1'] },
        ],
      });
    });

    test('falls back to a status-based message for unknown statuses without error', () => {
      const results = [{ identifier: 'p1', status: 'pending', error: null }];

      expect(groupEnrollmentResults(results)).toEqual({
        completed: [],
        errorGroups: [{ error: 'Enrollment pending.', identifiers: ['p1'] }],
      });
    });
  });

  describe('extractApiErrorMessage', () => {
    test('returns plain-string data', () => {
      expect(extractApiErrorMessage({ data: 'Server exploded' })).toBe('Server exploded');
    });

    test('returns detail', () => {
      expect(extractApiErrorMessage({ data: { detail: 'Not set up.' } })).toBe('Not set up.');
    });

    test('returns message', () => {
      expect(extractApiErrorMessage({ data: { message: 'Bad request.' } })).toBe('Bad request.');
    });

    test('joins non_field_errors', () => {
      expect(extractApiErrorMessage({
        data: { non_field_errors: ['First problem.', 'Second problem.'] },
      })).toBe('First problem. Second problem.');
    });

    test('formats field-level errors', () => {
      expect(extractApiErrorMessage({
        data: { identifiers: ['This field is required.', 'Too long.'], other: 'Invalid.' },
      })).toBe('identifiers: This field is required., Too long.\nother: Invalid.');
    });

    test('falls back to error.message when data is empty', () => {
      expect(extractApiErrorMessage({ data: {}, message: 'Network Error' })).toBe('Network Error');
    });

    test('falls back to the generic message', () => {
      expect(extractApiErrorMessage({})).toBe(DEFAULT_ENROLLMENT_ERROR);
      expect(extractApiErrorMessage(undefined)).toBe(DEFAULT_ENROLLMENT_ERROR);
      expect(extractApiErrorMessage({ data: '' })).toBe(DEFAULT_ENROLLMENT_ERROR);
    });
  });
});
