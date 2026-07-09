/* eslint-disable react/prop-types */
import { fireEvent, waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import InstructorsDetailPage from 'features/Instructors/InstructorsDetailPage';
import { RequestStatus } from 'features/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('features/Classes/data/thunks', () => ({
  fetchClassesData: jest.fn(() => ({ type: 'FETCH_CLASSES' })),
}));

jest.mock('features/Instructors/data', () => ({
  ...jest.requireActual('features/Instructors/data'),
  fetchInstructorsData: jest.fn(() => ({ type: 'FETCH_INSTRUCTORS' })),
  fetchEventsData: jest.fn(() => ({ type: 'FETCH_EVENTS' })),
  fetchInstructorProfile: jest.fn(() => ({ type: 'FETCH_PROFILE' })),
  resetEvents: jest.fn(() => ({ type: 'RESET_EVENTS' })),
  resetInstructorInfo: jest.fn(() => ({ type: 'RESET_INSTRUCTOR_INFO' })),
}));

jest.mock('react-paragon-topaz', () => ({
  ...jest.requireActual('react-paragon-topaz'),
  CalendarExpanded: ({ eventsList }) => (
    <div data-testid="calendar-expanded">
      <div>Today</div>
      {eventsList.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  ),
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
          classId: 'ccx-v1:1',
          className: 'Demo Class 1',
          masterCourseId: 'course-v1:1',
          masterCourseName: 'Demo MaterCourse 1',
          startDate: '2024-08-15',
          endDate: '2026-08-15',
          status: 'pending',
        },
        {
          classId: 'ccx-v1:2',
          className: 'Demo Class 2',
          masterCourseId: 'course-v1:2',
          masterCourseName: 'Demo MaterCourse 2',
          startDate: '2024-08-15',
          endDate: '2027-08-15',
          status: 'complete',
        },
        {
          classId: 'ccx-v1:3',
          className: 'Demo Class 3',
          masterCourseId: 'course-v1:3',
          masterCourseName: 'Demo MaterCourse 3',
          startDate: '2020-08-15',
          endDate: '2022-08-15',
          status: 'in progress',
        },
      ],
      count: 3,
      numPages: 2,
      current_page: 1,
      status: RequestStatus.SUCCESS,
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
      numPages: 1,
      current_page: 1,
      status: RequestStatus.SUCCESS,
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
      numPages: 1,
      current_page: 1,
      status: RequestStatus.SUCCESS,
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
      status: RequestStatus.SUCCESS,
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
      expect(component.container).toHaveTextContent('2');
    });
  });

  test('Should render the calendar', async () => {
    const { getByText } = renderPage();

    fireEvent.click(getByText('Availability'));

    await waitFor(() => {
      expect(getByText('Not available')).toBeInTheDocument();
      expect(getByText('Today')).toBeInTheDocument();
    });
  });
});
