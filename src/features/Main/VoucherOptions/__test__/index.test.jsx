import React from 'react';
import '@testing-library/jest-dom';
import { getConfig } from '@edx/frontend-platform';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import { assignVoucher, revokeVoucher } from 'features/Courses/data/api';
import VoucherOptions from 'features/Main/VoucherOptions';

import {
  VOUCHER_UI_LABELS,
  VOUCHER_SUCCESS_MESSAGES,
  VOUCHER_ERROR_MESSAGES,
  HTTP_STATUS,
} from 'features/constants';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('features/Courses/data/api', () => ({
  assignVoucher: jest.fn(),
  revokeVoucher: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(() => ({ id: 'inst-123', uuid: 'abc' })),
}));

describe('VoucherOptions', () => {
  const baseProps = {
    courseId: 'course-123',
    learnerEmail: 'student@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render when PSS_ENABLE_ASSIGN_VOUCHER is false', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: false });

    const { queryByText } = renderWithProviders(<VoucherOptions {...baseProps} />);
    expect(queryByText(VOUCHER_UI_LABELS.ASSIGN)).toBeNull();
    expect(queryByText(VOUCHER_UI_LABELS.REVOKE)).toBeNull();
  });

  test('should render both options when enabled', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });

    renderWithProviders(<VoucherOptions {...baseProps} />);

    expect(screen.getByText(VOUCHER_UI_LABELS.ASSIGN)).toBeInTheDocument();
    expect(screen.getByText(VOUCHER_UI_LABELS.REVOKE)).toBeInTheDocument();
  });

  test('should show success message when voucher is assigned successfully', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });
    assignVoucher.mockResolvedValueOnce({ status: HTTP_STATUS.SUCCESS });

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.ASSIGN));

    await waitFor(() => {
      expect(assignVoucher).toHaveBeenCalledWith({
        institution_id: 'inst-123',
        institution_uuid: 'abc',
        course_id: 'course-123',
        email: 'student@example.com',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(VOUCHER_SUCCESS_MESSAGES.ASSIGN)).toBeInTheDocument();
    });
  });

  test('should show error message when assignment fails', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });
    assignVoucher.mockRejectedValueOnce(new Error('Server error'));

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.ASSIGN));

    await waitFor(() => {
      expect(
        screen.getByText(VOUCHER_ERROR_MESSAGES.ASSIGN),
      ).toBeInTheDocument();
    });
  });

  test('should show loading state while assigning voucher', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });

    assignVoucher.mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ status: HTTP_STATUS.SUCCESS }), 150);
      }),
    );

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.ASSIGN));

    expect(screen.getByText(VOUCHER_UI_LABELS.ASSIGNING)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(VOUCHER_SUCCESS_MESSAGES.ASSIGN)).toBeInTheDocument();
      expect(screen.getByText(VOUCHER_UI_LABELS.ASSIGN)).toBeInTheDocument();
    });
  });

  test('should show success message when voucher is revoked successfully', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });
    revokeVoucher.mockResolvedValueOnce({ status: HTTP_STATUS.SUCCESS });

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.REVOKE));

    await waitFor(() => {
      expect(revokeVoucher).toHaveBeenCalledWith({
        institution_id: 'inst-123',
        institution_uuid: 'abc',
        course_id: 'course-123',
        email: 'student@example.com',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(VOUCHER_SUCCESS_MESSAGES.REVOKE)).toBeInTheDocument();
    });
  });

  test('should show not found message on 404 revoke error', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });

    revokeVoucher.mockRejectedValueOnce({
      customAttributes: { httpErrorStatus: HTTP_STATUS.NOT_FOUND },
    });

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.REVOKE));

    await waitFor(() => {
      expect(
        screen.getByText(VOUCHER_ERROR_MESSAGES.NOT_FOUND),
      ).toBeInTheDocument();
    });
  });

  test('should show missing exam series message on 422 revoke error', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });

    revokeVoucher.mockRejectedValueOnce({
      customAttributes: { httpErrorStatus: HTTP_STATUS.UNPROCESSABLE },
    });

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.REVOKE));

    await waitFor(() => {
      expect(
        screen.getByText(VOUCHER_ERROR_MESSAGES.UNPROCESSABLE),
      ).toBeInTheDocument();
    });
  });

  test('should show default revoke error message for unexpected revoke errors', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });

    revokeVoucher.mockRejectedValueOnce(new Error('Unknown error'));

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.REVOKE));

    await waitFor(() => {
      expect(
        screen.getByText(VOUCHER_ERROR_MESSAGES.REVOKE),
      ).toBeInTheDocument();
    });
  });

  test('should show loading state while revoking voucher', async () => {
    getConfig.mockReturnValue({ PSS_ENABLE_ASSIGN_VOUCHER: true });

    revokeVoucher.mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => resolve({ status: HTTP_STATUS.SUCCESS }), 150);
      }),
    );

    renderWithProviders(<VoucherOptions {...baseProps} />);

    fireEvent.click(screen.getByText(VOUCHER_UI_LABELS.REVOKE));

    expect(screen.getByText(VOUCHER_UI_LABELS.REVOKING)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(VOUCHER_SUCCESS_MESSAGES.REVOKE)).toBeInTheDocument();
      expect(screen.getByText(VOUCHER_UI_LABELS.REVOKE)).toBeInTheDocument();
    });
  });
});
