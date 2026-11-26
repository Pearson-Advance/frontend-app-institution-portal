import React from 'react';
import { waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import { LICENSE_POOL_TYPES } from 'features/constants';
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

  test('Should render the same courses view for an offering-type license', async () => {
    const offeringStore = {
      ...mockStore,
      licenses: {
        table: {
          data: [
            {
              licenseId: 1,
              licenseName: 'Offering License',
              licenseType: LICENSE_POOL_TYPES.OFFERING,
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

    const component = renderWithProviders(
      <Route
        path="/licenses/:licenseId"
        element={<LicensesDetailPage />}
      />,
      {
        preloadedState: offeringStore,
        initialEntries: ['/licenses/1'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent(
        'Courses for which a license can be used/assigned from this pool.',
      );
      expect(component.container).toHaveTextContent('Course');
      expect(component.container).not.toHaveTextContent('Program-type licenses');
    });
  });
});
