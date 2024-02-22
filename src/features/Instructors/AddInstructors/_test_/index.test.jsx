import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AddInstructors from 'features/Instructors/AddInstructors';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { RequestStatus } from 'features/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  instructors: {
    table: {
    },
    classes: {
      data: [],
    },
    courses: {
      data: [],
    },
    filters: {
    },
    rowsSelected: [],
    classSelected: '',
    addInstructor: {
      status: RequestStatus.LOADING,
      error: null,
      data: [],
    },
  },
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
};

describe('Add instructor modal', () => {
  test('Render add insctructor modal', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <IntlProvider locale="en">
        <AddInstructors isOpen onClose={() => {}} />
      </IntlProvider>,
      { preloadedState: mockStore },
    );

    const cancelButton = getByText('Cancel');
    const sendButton = getByText('Send invite');

    waitFor(() => {
      expect(getByText('Add new instructor')).toBeInTheDocument();
      expect(getByPlaceholderText('Enter Email of the instructor')).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(sendButton).toBeInTheDocument();
    });

    fireEvent.click(sendButton);
  });
});
