import { waitFor } from '@testing-library/react';
import OfferingsPage from 'features/Offerings/OfferingsPage';
import { renderWithProviders } from 'test-utils';
import { Route } from 'react-router-dom';

const mockStore = {
  offerings: {
    table: {
      data: [
        { id: 1, name: 'Sample Offering', numberOfRuns: 0 },
      ],
      count: 1,
      status: 'success',
    },
  },
};

describe('OfferingsPage component', () => {
  test('renders exactly one seeded offering', async () => {
    const component = renderWithProviders(
      <Route path="/offerings" element={<OfferingsPage />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/offerings'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Offerings');
      expect(component.container).toHaveTextContent('Sample Offering');
      expect(component.container).not.toHaveTextContent('No offerings found.');
    });

    // header row + a single data row.
    expect(component.getAllByRole('row')).toHaveLength(2);
  });
});
