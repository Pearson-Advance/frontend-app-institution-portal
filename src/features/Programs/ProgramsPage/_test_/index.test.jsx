import { waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';
import ProgramsPage from 'features/Programs/ProgramsPage';
import { getPrograms } from 'features/Programs/data/api';
import { getLicensesByInstitution } from 'features/Common/data/api';
import { renderWithProviders } from 'test-utils';

jest.mock('features/Programs/data/api', () => ({
  getPrograms: jest.fn(),
  getProgramDetail: jest.fn(),
}));

jest.mock('features/Common/data/api', () => ({
  getLicensesByInstitution: jest.fn(),
}));

const mockProgramsResponse = {
  data: {
    count: 2,
    num_pages: 1,
    results: [
      {
        id: 1,
        name: 'Cloud Practitioner Program',
        courses_count: 3,
        runs_count: 2,
      },
      {
        id: 2,
        name: 'Data Analytics Program',
        courses_count: 2,
        runs_count: 0,
      },
    ],
  },
};

const defaultPreloadedState = {
  main: {
    selectedInstitution: { id: 1, name: 'Test Institution' },
  },
  programs: {
    currentPage: 1,
  },
};

describe('ProgramsPage component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getLicensesByInstitution.mockResolvedValue({ data: [] });
  });

  test('renders the programs listing with program, courses and sessions columns', async () => {
    getPrograms.mockResolvedValueOnce(mockProgramsResponse);

    const component = renderWithProviders(
      <Route path="/programs" element={<ProgramsPage />} />,
      {
        preloadedState: defaultPreloadedState,
        initialEntries: ['/programs'],
      },
    );

    await waitFor(() => {
      expect(getPrograms).toHaveBeenCalledWith(1, 1, 10, {});
      expect(component.container).toHaveTextContent('Programs');
      expect(component.container).toHaveTextContent('Courses');
      expect(component.container).toHaveTextContent('Sessions');
      expect(component.container).toHaveTextContent('Cloud Practitioner Program');
      expect(component.container).toHaveTextContent('Data Analytics Program');
      expect(component.container).not.toHaveTextContent('No programs found.');
    });

    // header row + two data rows.
    expect(component.getAllByRole('row')).toHaveLength(3);
  });

  test('renders the empty state when there are no programs', async () => {
    getPrograms.mockResolvedValueOnce({
      data: { count: 0, num_pages: 1, results: [] },
    });

    const component = renderWithProviders(
      <Route path="/programs" element={<ProgramsPage />} />,
      {
        preloadedState: defaultPreloadedState,
        initialEntries: ['/programs'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('No programs found.');
    });
  });
});
