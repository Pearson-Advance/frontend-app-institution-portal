import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import InstructorCard from 'features/Classes/InstructorCard';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const basePath = `/courses/${encodeURIComponent(
  'course-v1:XXX+YYY+2023',
)}/${encodeURIComponent('ccx-v1')}`;

const stateMock = {
  instructors: {
    selectOptions: {
      data: [
        {
          instructorUsername: 'Sam Sepiol',
          instructorImage: null,
          instructorName: 'Sam Deer',
        },
      ],
    },
  },
  classes: {
    allClasses: {
      data: [{
        startDate: '2024-02-13T17:42:22Z',
        classId: 'ccx-v1',
        className: 'demo class',
        masterCourseName: 'Demo course',
        instructors: ['Sam Sepiol'],
        numberOfStudents: 2,
        numberOfPendingStudents: 1,
        maxStudents: 5,
      }],
    },
  },
};

describe('InstructorCard', () => {
  const renderComponent = (customState = stateMock) => renderWithProviders(
    <Route
      path="/courses/:courseId/:classId"
      element={<InstructorCard isOpen onClose={() => {}} />}
    />,
    {
      preloadedState: customState,
      initialEntries: [basePath],
    },
  );

  test('Should render with correct elements', () => {
    const { getByText } = renderComponent();

    expect(getByText('Demo course')).toBeInTheDocument();
    expect(getByText('demo class')).toBeInTheDocument();
    expect(getByText('Sam Deer')).toBeInTheDocument();
    expect(getByText('Feb 13, 2024')).toBeInTheDocument();
  });

  test('Should render multiple instructors', () => {
    const { getByText } = renderComponent({
      instructors: {
        selectOptions: {
          data: [
            { instructorUsername: 'Sam Sepiol', instructorName: 'Sam Deer' },
            { instructorUsername: 'Aldo Pearson', instructorName: 'Aldo Pearson' },
            { instructorUsername: 'John Deer', instructorName: 'John Deer' },
            { instructorUsername: 'Deer Ton', instructorName: 'Deer Ton' },
          ],
        },
      },
      classes: {
        allClasses: {
          data: [
            {
              ...stateMock.classes.allClasses.data[0],
              instructors: [
                'Sam Sepiol',
                'Aldo Pearson',
                'John Deer',
                'Deer Ton',
              ],
            },
          ],
        },
      },
    });

    expect(getByText(/more\.\.\./)).toBeInTheDocument();
    expect(getByText(/Manage instructors/)).toBeInTheDocument();
  });

  test('Should render assign instructor button if the instructor is not present', () => {
    const { getByText } = renderComponent({
      classes: {
        allClasses: {
          data: [
            {
              ...stateMock.classes.allClasses.data[0],
              instructors: [],
              endDate: '2025-02-13T17:42:22Z',
            },
          ],
        },
      },
    });

    expect(getByText('Assign instructor')).toBeInTheDocument();
  });

  test('Should render both dates when the duration is to long', () => {
    const { getByText } = renderComponent({
      classes: {
        allClasses: {
          data: [
            {
              ...stateMock.classes.allClasses.data[0],
              endDate: '2025-02-13T17:42:22Z',
            },
          ],
        },
      },
    });

    expect(getByText('Feb 13, 2024 - Feb 13, 2025')).toBeInTheDocument();
  });

  test('Should render the date when the course take couple months', () => {
    const { getByText } = renderComponent({
      classes: {
        allClasses: {
          data: [
            {
              ...stateMock.classes.allClasses.data[0],
              endDate: '2024-03-13T17:42:22Z',
            },
          ],
        },
      },
    });

    expect(getByText('Feb 13 - Mar 13, 2024')).toBeInTheDocument();
  });

  test('Should render the date when the course take one single month', () => {
    const { getByText } = renderComponent({
      classes: {
        allClasses: {
          data: [
            {
              ...stateMock.classes.allClasses.data[0],
              endDate: '2024-02-20T17:42:22Z',
            },
          ],
        },
      },
    });

    expect(getByText('Feb 13-20, 2024')).toBeInTheDocument();
  });

  test('Should render enrollment info with valid values', () => {
    const { container } = renderComponent({
      classes: {
        allClasses: {
          data: [
            {
              ...stateMock.classes.allClasses.data[0],
              purchasedSeats: 4,
            },
          ],
        },
      },
    });

    expect(container).toHaveTextContent('Enrollment:3 enrolled, 2 seats available, 4 licenses');
  });

  test('Should render no max and 0 when null values are provided', () => {
    const { container } = renderComponent({
      classes: {
        allClasses: {
          data: [
            {
              ...stateMock.classes.allClasses.data[0],
              numberOfStudents: null,
              numberOfPendingStudents: null,
              purchasedSeats: null,
              maxStudents: null,
            },
          ],
        },
      },
    });

    expect(container).toHaveTextContent('Enrollment:0 enrolled, no max , 0 license remaining');
  });
});
