import { waitFor } from '@testing-library/react';
import ProgramsPage from 'features/Programs/ProgramsPage';
import { renderWithProviders } from 'test-utils';
import { Route } from 'react-router-dom';

const mockStore = {
  programs: {
    table: {
      data: [
        { id: 1, name: 'Sample Program', numberOfRuns: 0 },
      ],
      count: 1,
      status: 'success',
    },
  },
};

describe('ProgramsPage component', () => {
  test('renders exactly one seeded program', async () => {
    const component = renderWithProviders(
      <Route path="/programs" element={<ProgramsPage />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/programs'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Programs');
      expect(component.container).toHaveTextContent('Sample Program');
      expect(component.container).not.toHaveTextContent('No programs found.');
    });

    // header row + a single data row.
    expect(component.getAllByRole('row')).toHaveLength(2);
  });
});
