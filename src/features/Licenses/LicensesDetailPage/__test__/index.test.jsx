import React from 'react';
import { waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import LicensesDetailPage from 'features/Licenses/LicensesDetailPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: {
    selectedInstitution: {
      id: 1,
      name: 'Institution 1',
      shortName: 'Test',
      active: true,
      externalId: '',
      created: '2023-06-22T22:48:56.124907Z',
      modified: '2023-06-22T22:48:56.124907Z',
      label: 'Institution 1',
      value: 1,
    },
  },
  courses: {
    table: {
      data: [
        {
          course: 'Demo Course 1',
          enrolled: 3,
        },
        {
          course: 'Demo Course 2',
          enrolled: 10,
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
  },
  licenses: {
    table: {
      data: [
        {
          licenseName: 'License Demo',
          purchasedSeats: 20,
          numberOfStudents: 10,
          numberOfPendingStudents: 5,
        },
      ],
      count: 1,
      num_pages: 1,
      current_page: 1,
    },
  },
};

describe('LicensesDetailPage', () => {
  test('Should render the table and the course info', async () => {
    const component = renderWithProviders(
      <Route
        path="/licenses/:licenseId"
        element={<LicensesDetailPage />}
      />,
      {
        preloadedState: mockStore,
        initialEntries: ['/licenses/1'],
      },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Demo Course 1');
      expect(component.container).toHaveTextContent('Demo Course 2');
      expect(component.container).toHaveTextContent('3');
      expect(component.container).toHaveTextContent('10');
    });
  });
});
