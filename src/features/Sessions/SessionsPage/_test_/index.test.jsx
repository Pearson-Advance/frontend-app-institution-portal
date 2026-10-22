import { waitFor } from '@testing-library/react';
import SessionsPage from 'features/Sessions/SessionsPage';
import { renderWithProviders } from 'test-utils';
import { Route } from 'react-router-dom';

const mockStore = {
  sessions: {
    table: {
      data: [],
      count: 0,
      status: 'success',
    },
  },
};

describe('SessionsPage component', () => {
  test('renders the empty state when there are no sessions', async () => {
    const component = renderWithProviders(
      <Route path="/sessions" element={<SessionsPage />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/sessions'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Sessions');
      expect(component.container).toHaveTextContent(
        'No sessions yet. Create a session from a Program to get started.',
      );
    });
  });
});
