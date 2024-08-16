import React from 'react';
import { renderWithProviders } from 'test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import EnrollStudent from 'features/Classes/EnrollStudent';

import * as api from 'features/Students/data/api';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ courseId: 'Demo course', classId: 'ccx-v1' })),
}));

jest.mock('features/Students/data/api', () => ({
  handleEnrollments: jest.fn().mockReturnValue({}),
  getMessages: jest.fn().mockReturnValue({}),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  classes: {
    allClasses: {
      data: [
        {
          classId: 'ccx-v1',
          className: 'demo class',
        },
      ],
    },
  },
};

describe('EnrollStudent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render with correct elements', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <EnrollStudent isOpen onClose={() => {}} />,
      { preloadedState: mockStore },
    );

    expect(getByText('Invite student to enroll')).toBeInTheDocument();
    expect(getByText('Class: demo class')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter email of the student to enroll')).toBeInTheDocument();
    expect(getByText('Send invite')).toBeInTheDocument();
  });

  test('Should handle form submission and shows success toast', async () => {
    const onCloseMock = jest.fn();

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} />,
      { preloadedState: mockStore },
    );

    const handleEnrollmentsMock = jest.spyOn(api, 'handleEnrollments').mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
        }],
      },
    });

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message').textContent).toBe('Successfully enrolled and sent email to the following user:\ntest@example.com');
    });

    expect(handleEnrollmentsMock).toHaveBeenCalledTimes(1);
    handleEnrollmentsMock.mockRestore();
  });

  test('Should handle form submission and show error toast', async () => {
    const onCloseMock = jest.fn();

    const messagesApiMock = jest.spyOn(api, 'getMessages').mockResolvedValue({
      data: {
        results: [{ tags: 'error', message: 'Enrollment limit reached' }],
      },
    });

    const { getByPlaceholderText, getByText } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} />,
      { preloadedState: mockStore },
    );

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Enrollment limit reached')).toBeInTheDocument();
    });

    expect(messagesApiMock).toHaveBeenCalledTimes(1);

    messagesApiMock.mockRestore();
  });

  test('Should handle form submission and show error toast for invalid email', async () => {
    const onCloseMock = jest.fn();

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} />,
      { preloadedState: mockStore },
    );

    const handleEnrollmentsMock = jest.spyOn(api, 'handleEnrollments').mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
          invalidIdentifier: true,
        }],
      },
    });

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message').textContent).toBe('The following email adress is invalid:\ntest@example.com\n');
    });

    expect(handleEnrollmentsMock).toHaveBeenCalledTimes(1);
    handleEnrollmentsMock.mockRestore();
  });
});
