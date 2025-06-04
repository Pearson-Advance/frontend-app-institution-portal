/* eslint-disable react/prop-types */
import React from 'react';
import {
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { Dropdown } from '@edx/paragon';
import '@testing-library/jest-dom/extend-expect';

import { renderWithProviders } from 'test-utils';
import { deleteEnrollment } from 'features/Main/data/api';
import DeleteEnrollment from 'features/Main/DeleteEnrollment';

jest.mock('features/Main/data/api', () => ({
  deleteEnrollment: jest.fn(),
}));

const mockDeleteEnrollment = deleteEnrollment;

const createMockStore = (studentEmail = 'testuser@example.com') => ({
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
  students: {
    table: {
      next: null,
      previous: null,
      count: 1,
      numPages: 1,
      currentPage: 1,
      start: 0,
      data: [
        {
          learnerName: 'Test User',
          learnerEmail: studentEmail,
          courseId: 'course-v1:demo+demo1+2020',
          courseName: 'Demo Course 1',
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          className: 'test ccx1',
          created: '2024-02-13T18:31:27.399407Z',
          status: 'Active',
          examReady: false,
          startDate: '2024-02-13T17:42:22Z',
          endDate: null,
          completePercentage: 0.0,
        },
      ],
    },
  },
});

const defaultProps = {
  studentEmail: 'test@example.com',
  courseId: 'course-v1:demo+demo1+2020',
};

const renderDeleteEnrollment = (props = {}, storeOverrides = {}) => {
  const finalProps = { ...defaultProps, ...props };
  const mockStore = createMockStore(finalProps.studentEmail);
  const finalStore = { ...mockStore, ...storeOverrides };

  return renderWithProviders(
    <Dropdown className="dropdowntpz">
      <Dropdown.Toggle
        id="dropdown-toggle-with-iconbutton"
        variant="primary"
        data-testid="dropdown-action"
        alt="menu for actions"
      />
      <Dropdown.Menu>
        <DeleteEnrollment {...finalProps} />
      </Dropdown.Menu>
    </Dropdown>,
    { preloadedState: finalStore },
  );
};

const openDropdown = () => {
  const dropdownToggle = screen.getByTestId('dropdown-action');
  fireEvent.click(dropdownToggle);
};

const openConfirmationModal = () => {
  openDropdown();

  waitFor(() => {
    const modalTrigger = screen.getByTestId('delete-enrollment');
    fireEvent.click(modalTrigger);
  });
};

const proceedWithDeletion = () => {
  const proceedButton = screen.getByText('Proceed');

  fireEvent.click(proceedButton);
};

describe('DeleteEnrollment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('should render delete enrollment dropdown item when dropdown is opened', () => {
      renderDeleteEnrollment();

      openDropdown();

      const deleteItems = screen.getAllByText('Delete Enrollment');
      expect(deleteItems.length).toBeGreaterThan(0);
    });
  });

  describe('Confirmation Modal', () => {
    test('should open confirmation modal when delete enrollment is clicked', () => {
      renderDeleteEnrollment();

      openConfirmationModal();

      expect(screen.getByText(/You are attempting to unenroll a student./i)).toBeInTheDocument();
      expect(screen.getByText(/Do you wish to proceed?/i)).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Proceed')).toBeInTheDocument();
    });

    test('should close confirmation modal when cancel is clicked', () => {
      renderDeleteEnrollment();

      openConfirmationModal();
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText(/You are attempting to unenroll a student./i)).not.toBeInTheDocument();
    });
  });

  describe('Successful Enrollment Deletion', () => {
    test('should show success toast and update store when deletion is successful', async () => {
      mockDeleteEnrollment.mockResolvedValueOnce({
        data: { results: [{}] },
      });

      renderDeleteEnrollment();

      openConfirmationModal();
      proceedWithDeletion();

      await waitFor(() => {
        expect(screen.getByTestId('toast-message')).toHaveTextContent('Enrollment deleted successfully.');
      });

      expect(mockDeleteEnrollment).toHaveBeenCalledWith(
        defaultProps.studentEmail,
        defaultProps.courseId,
      );
    });

    test('should show processing state while deletion is in progress', async () => {
      let resolvePromise;
      mockDeleteEnrollment.mockReturnValueOnce(
        new Promise(resolve => { resolvePromise = resolve; }),
      );

      renderDeleteEnrollment();

      openConfirmationModal();
      proceedWithDeletion();

      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(screen.getByText('Processing...')).toBeDisabled();

      resolvePromise({ data: { results: [{}] } });

      await waitFor(() => {
        expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should show threshold error modal when API returns error result', async () => {
      mockDeleteEnrollment.mockResolvedValueOnce({
        data: { results: [{ error: true }] },
      });

      renderDeleteEnrollment();

      openConfirmationModal();
      proceedWithDeletion();

      await waitFor(() => {
        expect(screen.getByText(/This student has reached a threshold of course activity/)).toBeInTheDocument();
      });

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    test('should show generic error modal when API throws unexpected error', async () => {
      mockDeleteEnrollment.mockRejectedValueOnce(new Error('Network error'));

      renderDeleteEnrollment();

      openConfirmationModal();
      proceedWithDeletion();

      await waitFor(() => {
        expect(screen.getByText(/Unexpected error occurred. Please try again later./i)).toBeInTheDocument();
      });

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    test('should reset all modals when dismiss button is clicked on error modal', async () => {
      mockDeleteEnrollment.mockRejectedValueOnce(new Error('Network error'));

      renderDeleteEnrollment();

      openConfirmationModal();
      proceedWithDeletion();

      await waitFor(() => {
        expect(screen.getByText(/Unexpected error occurred. Please try again later./i)).toBeInTheDocument();
      });

      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);

      expect(screen.queryByText('Error')).not.toBeInTheDocument();
      expect(screen.queryByText(/Unexpected error occurred. Please try again later./i)).not.toBeInTheDocument();
    });
  });

  describe('Toast Functionality', () => {
    test('should close success toast when close button is triggered', async () => {
      mockDeleteEnrollment.mockResolvedValueOnce({
        data: { results: [{}] },
      });

      renderDeleteEnrollment();

      openConfirmationModal();
      proceedWithDeletion();

      await waitFor(() => {
        expect(screen.getByTestId('toast-message')).toBeInTheDocument();
      });

      const toast = screen.getByTestId('toast-message');
      fireEvent.click(toast);

      expect(screen.getByTestId('toast-message')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    test('should call deleteEnrollment API with correct parameters', async () => {
      mockDeleteEnrollment.mockResolvedValueOnce({
        data: { results: [{}] },
      });

      const customProps = {
        studentEmail: 'custom@test.com',
        courseId: 'custom-course-id',
      };

      renderDeleteEnrollment(customProps);

      openConfirmationModal();
      proceedWithDeletion();

      await waitFor(() => {
        expect(mockDeleteEnrollment).toHaveBeenCalledWith(
          customProps.studentEmail,
          customProps.courseId,
        );
      });
    });
  });
});
