import { fireEvent, waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import InstructorsDetailPage from 'features/Instructors/InstructorsDetailPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
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
  classes: {
    table: {
      data: [
        {
          className: 'Demo Class 1',
          masterCourseName: 'Demo MaterCourse 1',
          startDate: '2024-08-15',
          endDate: '2026-08-15',
          status: 'pending',
        },
        {
          className: 'Demo Class 2',
          masterCourseName: 'Demo MaterCourse 2',
          startDate: '2024-08-15',
          endDate: '2027-08-15',
          status: 'complete',
        },
        {
          className: 'Demo Class 3',
          masterCourseName: 'Demo MaterCourse 3',
          startDate: '2020-08-15',
          endDate: '2022-08-15',
          status: 'in progress',
        },
      ],
      count: 3,
      num_pages: 1,
      current_page: 1,
    },
  },
  instructors: {
    table: {
      data: [
        {
          instructorUsername: 'instructor',
          instructorName: 'Instructor 1',
          instructorEmail: 'instructor1@example.com',
          ccxId: 'CCX1',
          ccxName: 'CCX 1',
        },
      ],
      count: 1,
      num_pages: 1,
      current_page: 1,
    },
    events: {
      data: [
        {
          id: 1,
          title: 'Not available',
          start: '2024-09-04T00:00:00Z',
          end: '2024-09-13T00:00:00Z',
          type: 'virtual',
        },
      ],
      count: 1,
      num_pages: 1,
      current_page: 1,
    },
    instructorProfile: {
      instructorId: 20,
      instructorImage: '',
      instructorUsername: 'instructor',
      instructorName: 'Instructor 3 ',
      instructorEmail: 'instructor2@example.com',
      lastAccess: '2024-02-26T15:53:03Z',
      created: '2024-02-26T15:53:02Z',
      classes: 2,
      status: 'success',
    },
  },
};

describe('InstructorsDetailPage', () => {
  const renderPage = () => renderWithProviders(
    <Route
      path="/instructors/:instructorUsername"
      element={<InstructorsDetailPage />}
    />,
    {
      preloadedState: mockStore,
      initialEntries: ['/instructors/instructor'],
    },
  );

  test('Should render instructor profile', async () => {
    const component = renderPage();

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Profile');
      expect(component.container).toHaveTextContent('Instructor 3');
      expect(component.container).toHaveTextContent('instructor1@example.com');
      expect(component.container).toHaveTextContent('Courses taught');
      expect(component.container).toHaveTextContent('Instructor since');
      expect(component.container).toHaveTextContent('02/26/24');
      expect(component.container).toHaveTextContent('last online');
      expect(component.container).toHaveTextContent('02/26/24');
    });
  });

  test('renders classes data and pagination', async () => {
    const component = renderPage();

    fireEvent.click(component.getByText('Classes'));

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Demo Class 1');
      expect(component.container).toHaveTextContent('Demo Class 2');
      expect(component.container).toHaveTextContent('Demo Class 3');
      expect(component.container).toHaveTextContent('Demo MaterCourse 1');
      expect(component.container).toHaveTextContent('Demo MaterCourse 2');
      expect(component.container).toHaveTextContent('Demo MaterCourse 3');
      expect(component.container).toHaveTextContent('08/15/24 - 08/15/26');
      expect(component.container).toHaveTextContent('08/15/24 - 08/15/27');
      expect(component.container).toHaveTextContent('08/15/20 - 08/15/22');
      expect(component.container).toHaveTextContent('Pending');
      expect(component.container).toHaveTextContent('Complete');
    });
  });

  test('Should render the calendar', async () => {
    const { getByText } = renderPage();

    fireEvent.click(getByText('Availability'));

    await waitFor(() => {
      expect(getByText('Today')).toBeInTheDocument();
      expect(getByText('Sunday')).toBeInTheDocument();
      expect(getByText('Monday')).toBeInTheDocument();
      expect(getByText('Tuesday')).toBeInTheDocument();
      expect(getByText('Wednesday')).toBeInTheDocument();
      expect(getByText('Thursday')).toBeInTheDocument();
      expect(getByText('Friday')).toBeInTheDocument();
      expect(getByText('Saturday')).toBeInTheDocument();
    });
  });
});
