import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';

import StatusFilters from 'features/Classes/StatusFilters';
import { CLASS_STATUS_TABS } from 'features/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const ControlledStatusFilters = () => {
  const [statusFilter, setStatusFilter] = React.useState(CLASS_STATUS_TABS.VISIBLE);
  return <StatusFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />;
};

describe('Classes StatusFilters component', () => {
  test('renders all status tabs from CLASS_STATUS_TABS', () => {
    renderWithProviders(<ControlledStatusFilters />);

    Object.values(CLASS_STATUS_TABS).forEach((tabLabel) => {
      expect(screen.getByRole('tab', { name: tabLabel })).toBeInTheDocument();
    });
  });

  test('defaults to Visible and sets hidden=false in the filters', async () => {
    const { store } = renderWithProviders(<ControlledStatusFilters />);

    await waitFor(() => {
      expect(store.getState().classes.filters).toEqual({ hidden: false });
    });
  });

  test('selecting Hidden sets hidden=true', async () => {
    const { store } = renderWithProviders(<ControlledStatusFilters />);

    fireEvent.click(screen.getByRole('tab', { name: CLASS_STATUS_TABS.HIDDEN }));

    await waitFor(() => {
      expect(store.getState().classes.filters).toEqual({ hidden: true });
    });
  });

  test('selecting All removes the hidden key', async () => {
    const { store } = renderWithProviders(<ControlledStatusFilters />);

    fireEvent.click(screen.getByRole('tab', { name: CLASS_STATUS_TABS.ALL }));

    await waitFor(() => {
      expect(store.getState().classes.filters).not.toHaveProperty('hidden');
    });
  });

  test('merges hidden with existing filters without clobbering them', async () => {
    const preloadedState = {
      classes: {
        table: { currentPage: 1 },
        filters: { courseId: 'course-1', class_name: 'demo' },
      },
    };

    const { store } = renderWithProviders(<ControlledStatusFilters />, { preloadedState });

    await waitFor(() => {
      expect(store.getState().classes.filters).toEqual({
        courseId: 'course-1',
        class_name: 'demo',
        hidden: false,
      });
    });
  });
});
