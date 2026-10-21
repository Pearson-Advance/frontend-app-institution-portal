import { waitFor } from '@testing-library/react';
import ProgramsPage from 'features/Programs/ProgramsPage';
import { renderWithProviders } from 'test-utils';
import { Route } from 'react-router-dom';

const mockStore = {
  programs: {
    table: {
      data: [
        {
          id: 1,
          name: 'Cloud Practitioner Program',
          numberOfCourses: 3,
          numberOfRuns: 2,
          studentsEnrolled: 48,
          courses: [],
        },
        {
          id: 2,
          name: 'Data Analytics Program',
          numberOfCourses: 2,
          numberOfRuns: 0,
          studentsEnrolled: 0,
          courses: [],
        },
      ],
      count: 2,
      status: 'success',
    },
  },
};

describe('ProgramsPage component', () => {
  test('renders the programs listing with program, courses, sessions and enrollment columns', async () => {
    const component = renderWithProviders(
      <Route path="/programs" element={<ProgramsPage />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/programs'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Programs');
      expect(component.container).toHaveTextContent('Courses');
      expect(component.container).toHaveTextContent('Sessions');
      expect(component.container).toHaveTextContent('Students enrolled');
      expect(component.container).toHaveTextContent('Cloud Practitioner Program');
      expect(component.container).toHaveTextContent('Data Analytics Program');
      expect(component.container).not.toHaveTextContent('No programs found.');
    });

    // header row + two data rows.
    expect(component.getAllByRole('row')).toHaveLength(3);
  });

  test('renders the empty state when there are no programs', async () => {
    const component = renderWithProviders(
      <Route path="/programs" element={<ProgramsPage />} />,
      {
        preloadedState: {
          programs: { table: { data: [], count: 0, status: 'success' } },
        },
        initialEntries: ['/programs'],
      },
    );

    await waitFor(() => {
      expect(component.container).toHaveTextContent('No programs found.');
    });
  });
});
