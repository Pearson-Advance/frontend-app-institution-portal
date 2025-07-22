import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

import StatusFilters from 'features/Instructors/StatusFilters';
import { INSTRUCTOR_STATUS_TABS } from 'features/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('Status Filters component', () => {
  const mockStore = {
    main: {
      selectedInstitution: { id: 1 },
    },
  };

  test('renders all status tabs from INSTRUCTOR_STATUS_TABS', () => {
    renderWithProviders(<StatusFilters currentPage={1} />, { preloadedState: mockStore });

    Object.values(INSTRUCTOR_STATUS_TABS).forEach((tabLabel) => {
      expect(screen.getByRole('tab', { name: tabLabel })).toBeInTheDocument();
    });
  });
});
