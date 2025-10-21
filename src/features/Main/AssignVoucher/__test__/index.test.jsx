import React from 'react';
import '@testing-library/jest-dom';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import { assignVoucher } from 'features/Courses/data/api';
import AssignVoucher from 'features/Main/AssignVoucher';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Courses/data/api', () => ({
  assignVoucher: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(() => ({ uuid: 'inst-123' })),
}));

describe('AssignVoucher', () => {
  const baseProps = {
    courseId: 'course-123',
    learnerEmail: 'student@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render if PSS_ENABLE_ASSIGN_VOUCHER is false', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: false });

    const { queryByText } = renderWithProviders(<AssignVoucher {...baseProps} />, {});
    expect(queryByText('Assign a voucher')).toBeNull();
  });

  test('renders correctly when PSS_ENABLE_ASSIGN_VOUCHER is true', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });

    renderWithProviders(<AssignVoucher {...baseProps} />);
    expect(screen.getByText('Assign a voucher')).toBeInTheDocument();
  });

  test('shows success toast when response status is 200', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });
    assignVoucher.mockResolvedValueOnce({ status: 200 });

    renderWithProviders(<AssignVoucher {...baseProps} />);
    fireEvent.click(screen.getByText('Assign a voucher'));

    await waitFor(() => {
      expect(assignVoucher).toHaveBeenCalledWith({
        institution_uuid: 'inst-123',
        course_id: 'course-123',
        email: 'student@example.com',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Voucher assigned successfully.')).toBeInTheDocument();
    });
  });

  test('shows error toast when request throws an exception', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });
    assignVoucher.mockRejectedValueOnce(new Error('Server error'));

    renderWithProviders(<AssignVoucher {...baseProps} />);
    fireEvent.click(screen.getByText('Assign a voucher'));

    await waitFor(() => {
      expect(logError).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText('An unexpected error occurred while assigning the voucher.'),
      ).toBeInTheDocument();
    });
  });

  test('disables button while assigning voucher', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });
    assignVoucher.mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ status: 200 }), 100);
      }),
    );

    renderWithProviders(<AssignVoucher {...baseProps} />);

    const dropdownItem = screen.getByText('Assign a voucher');

    fireEvent.click(dropdownItem);

    expect(screen.getByText('Assigning...')).toBeInTheDocument();
    expect(screen.queryByText('Assign a voucher')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Voucher assigned successfully.')).toBeInTheDocument();
      expect(screen.getByText('Assign a voucher')).toBeInTheDocument();
    });
  });
});
