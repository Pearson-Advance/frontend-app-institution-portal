import { fireEvent, waitFor } from '@testing-library/react';
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
    filters: {},
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
      expect(getPrograms).toHaveBeenCalledWith(1, 1, {});
      expect(component.container).toHaveTextContent('Programs');
      expect(component.container).toHaveTextContent('Courses');
      expect(component.container).toHaveTextContent('Sessions');
      expect(component.container).toHaveTextContent('Cloud Practitioner Program');
      expect(component.container).toHaveTextContent('Data Analytics Program');
      expect(component.container).not.toHaveTextContent('No programs found.');
    });

    // header row + two data rows.
    const rows = component.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent('Cloud Practitioner Program32');
    expect(component.container).not.toHaveTextContent('Students enrolled');
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

  test('sends the name filter to the API and resets it', async () => {
    getPrograms.mockResolvedValue(mockProgramsResponse);

    const component = renderWithProviders(
      <Route path="/programs" element={<ProgramsPage />} />,
      {
        preloadedState: { ...defaultPreloadedState, programs: { currentPage: 2, filters: {} } },
        initialEntries: ['/programs'],
      },
    );

    await waitFor(() => expect(getPrograms).toHaveBeenCalledWith(1, 1, {}));

    fireEvent.change(component.getByTestId('program-name-filter'), { target: { value: ' cloud ' } });
    fireEvent.click(component.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      expect(getPrograms).toHaveBeenLastCalledWith(1, 1, { name: 'cloud' });
      expect(component.store.getState().programs).toEqual({ currentPage: 1, filters: { name: 'cloud' } });
    });

    fireEvent.click(component.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(component.store.getState().programs.filters).toEqual({});
    });
  });

  test('shows an error message instead of the empty state when the request fails', async () => {
    getPrograms.mockRejectedValueOnce({ response: { status: 500 }, message: 'Server error' });

    const component = renderWithProviders(
      <Route path="/programs" element={<ProgramsPage />} />,
      {
        preloadedState: defaultPreloadedState,
        initialEntries: ['/programs'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Unable to load programs. Please try again later.');
    });
    expect(component.container).not.toHaveTextContent('No programs found.');
    expect(component.queryByRole('table')).not.toBeInTheDocument();
  });
});
