/* eslint-disable react/prop-types */
import {
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import { deleteEnrollment } from 'features/Main/data/api';
import DeleteEnrollment from 'features/Main/DeleteEnrollment';

/* =========================

   MOCK: react-paragon-topaz

   ========================= */
jest.mock('react-paragon-topaz', () => ({

  UNENROLL_ERROR_MESSAGE: 'You have exceeded the unenrollment threshold.',
  ConfirmationModal: ({
    isOpen,
    title,
    children,
    message,
    confirmText = 'Proceed',
    cancelText = 'Dismiss',
    onConfirm,
    onClose,
  }) => (isOpen ? (
    <div data-testid="confirmation-modal">
      <h1>{title}</h1>
      <div>
        {message}
        {children}
      </div>
      <button type="button" onClick={onConfirm}>{confirmText}</button>
      <button type="button" onClick={onClose}>{cancelText}</button>
    </div>
  ) : null),
}));

/* =========================

   MOCK: @openedx/paragon

   ========================= */
jest.mock('@openedx/paragon', () => {
  /* eslint-disable no-shadow, global-require */
  const React = require('react');
  return {
    Dropdown: Object.assign(
      ({ children }) => <div>{children}</div>,
      {
        Item: ({ children, ...props }) => (
          <button type="button" {...props}>{children}</button>
        ),
      },
    ),
    DropdownToggle: ({ children, ...props }) => (
      <button type="button" {...props}>{children}</button>
    ),
    DropdownMenu: ({ children }) => <div>{children}</div>,
    Toast: ({ show, children }) => (show ? (
      <div data-testid="toast-message">{children}</div>
    ) : null),
    useToggle: (initial = false) => {
      const [value, setValue] = React.useState(initial);

      return [
        value,
        () => setValue(true),
        () => setValue(false),
      ];
    },
  };
});

jest.mock('features/Main/data/api', () => ({
  deleteEnrollment: jest.fn(),
}));

const mockDeleteEnrollment = deleteEnrollment;

beforeAll(() => {
  const portalRoot = document.createElement('div');
  portalRoot.id = 'paragon-portal-root';
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderDeleteEnrollment = () => renderWithProviders(
  <DeleteEnrollment
    studentEmail="test@example.com"
    classId="class-id"
  />,
  {
    preloadedState: {
      main: { selectedInstitution: { id: 1 } },
      students: {
        table: { data: [{ learnerEmail: 'test@example.com' }] },
      },
    },
  },
);

const openConfirmationModal = async () => {
  fireEvent.click(await screen.findByTestId('delete-enrollment'));
  await screen.findByTestId('confirmation-modal');
};

describe('DeleteEnrollment Component', () => {
  describe('Initial Render', () => {
    test('should render delete enrollment dropdown item', async () => {
      renderDeleteEnrollment();

      expect(
        await screen.findByTestId('delete-enrollment'),
      ).toBeInTheDocument();
    });
  });

  describe('Confirmation Modal', () => {
    test('should open confirmation modal when delete enrollment is clicked', async () => {
      renderDeleteEnrollment();

      await openConfirmationModal();

      const modal = screen.getByTestId('confirmation-modal');
      const modalQueries = within(modal);

      expect(modal).toBeInTheDocument();
      expect(modalQueries.getByText('Delete Enrollment')).toBeInTheDocument();
      expect(modalQueries.getByText('Proceed')).toBeInTheDocument();
      expect(modalQueries.getByText('Dismiss')).toBeInTheDocument();
    });

    test('should close confirmation modal when cancel is clicked', async () => {
      renderDeleteEnrollment();

      await openConfirmationModal();

      fireEvent.click(screen.getByText('Dismiss'));

      await waitFor(() => {
        expect(
          screen.queryByTestId('confirmation-modal'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Successful Enrollment Deletion', () => {
    test('should show success toast when deletion is successful', async () => {
      mockDeleteEnrollment.mockResolvedValueOnce({
        data: { results: [{}] },
      });

      renderDeleteEnrollment();

      await openConfirmationModal();
      fireEvent.click(screen.getByText('Proceed'));

      expect(
        await screen.findByTestId('toast-message'),
      ).toHaveTextContent('Enrollment deleted successfully.');

      expect(mockDeleteEnrollment).toHaveBeenCalledWith(
        'test@example.com',
        'class-id',
      );
    });
  });

  describe('Error Handling', () => {
    test('should show threshold error modal when API returns error result', async () => {
      mockDeleteEnrollment.mockResolvedValueOnce({
        data: { results: [{ error: true }] },
      });

      renderDeleteEnrollment();

      await openConfirmationModal();
      fireEvent.click(screen.getByText('Proceed'));

      expect(
        await screen.findByText('You have exceeded the unenrollment threshold.'),
      ).toBeInTheDocument();
    });

    test('should show generic error modal when API throws unexpected error', async () => {
      mockDeleteEnrollment.mockRejectedValueOnce(new Error('Network error'));

      renderDeleteEnrollment();

      await openConfirmationModal();
      fireEvent.click(screen.getByText('Proceed'));

      expect(
        await screen.findByText(
          /Unexpected error occurred. Please try again later./i,
        ),
      ).toBeInTheDocument();
    });

    test('should reset modals when dismiss is clicked', async () => {
      mockDeleteEnrollment.mockRejectedValueOnce(new Error('Network error'));

      renderDeleteEnrollment();

      await openConfirmationModal();
      fireEvent.click(screen.getByText('Proceed'));

      await screen.findByText(
        /Unexpected error occurred. Please try again later./i,
      );

      fireEvent.click(screen.getByText('Dismiss'));

      await waitFor(() => {
        expect(
          screen.queryByTestId('confirmation-modal'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    test('should call deleteEnrollment API with correct parameters', async () => {
      mockDeleteEnrollment.mockResolvedValueOnce({
        data: { results: [{}] },
      });

      renderDeleteEnrollment();

      await openConfirmationModal();
      fireEvent.click(screen.getByText('Proceed'));

      await waitFor(() => {
        expect(mockDeleteEnrollment).toHaveBeenCalledWith(
          'test@example.com',
          'class-id',
        );
      });
    });
  });
});
