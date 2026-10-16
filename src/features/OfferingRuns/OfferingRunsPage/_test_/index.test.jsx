import { waitFor } from '@testing-library/react';
import OfferingRunsPage from 'features/OfferingRuns/OfferingRunsPage';
import { renderWithProviders } from 'test-utils';
import { Route } from 'react-router-dom';

const mockStore = {
  offeringRuns: {
    table: {
      data: [],
      count: 0,
      status: 'success',
    },
  },
};

describe('OfferingRunsPage component', () => {
  test('renders the empty state when there are no offering runs', async () => {
    const component = renderWithProviders(
      <Route path="/offering-runs" element={<OfferingRunsPage />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/offering-runs'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Offering runs');
      expect(component.container).toHaveTextContent(
        'No offering runs yet. Create a run from an Offering to get started.',
      );
    });
  });
});
