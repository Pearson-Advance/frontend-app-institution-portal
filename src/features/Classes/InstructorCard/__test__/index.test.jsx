import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import InstructorCard from 'features/Classes/InstructorCard';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

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
  test('Should render with correct elements', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      { preloadedState: stateMock },
    );

    expect(getByText('Demo course')).toBeInTheDocument();
    expect(getByText('demo class')).toBeInTheDocument();
    expect(getByText('Sam Deer')).toBeInTheDocument();
    expect(getByText('Feb 13, 2024')).toBeInTheDocument();
  });

  test('Should render multiple instructors', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          instructors: {
            selectOptions: {
              data: [
                {
                  instructorUsername: 'Sam Sepiol',
                  instructorImage: null,
                  instructorName: 'Sam Deer',
                },
                {
                  instructorUsername: 'Aldo Pearson',
                  instructorImage: null,
                  instructorName: 'Aldo Pearson',
                },
                {
                  instructorUsername: 'John Deer',
                  instructorImage: null,
                  instructorName: 'John Deer',
                },
                {
                  instructorUsername: 'Deer Ton',
                  instructorImage: null,
                  instructorName: 'Deer Ton',
                },
              ],
            },
          },
          classes: {
            allClasses: {
              data: [
                {
                  ...stateMock.classes.allClasses.data[0],
                  instructors: ['Sam Sepiol', 'Aldo Pearson', 'John Deer', 'Deer Ton'],
                },
              ],
            },
          },
        },
      },
    );

    expect(getByText(/more\.\.\./)).toBeInTheDocument();
    expect(getByText(/Manage instructors/)).toBeInTheDocument();
  });

  test('Should render assign instructor button if the instructor is not present', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          classes: {
            allClasses: {
              data: [
                {
                  ...stateMock.classes.allClasses.data[0],
                  startDate: '2024-02-13T17:42:22Z',
                  endDate: '2025-02-13T17:42:22Z',
                  instructors: [],
                },
              ],
            },
          },
        },
      },
    );

    expect(getByText('Assign instructor')).toBeInTheDocument();
  });

  test('Should render both dates when the duration is to long', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          classes: {
            allClasses: {
              data: [
                {
                  ...stateMock.classes.allClasses.data[0],
                  startDate: '2024-02-13T17:42:22Z',
                  endDate: '2025-02-13T17:42:22Z',
                },
              ],
            },
          },
        },
      },
    );

    expect(getByText('Feb 13, 2024 - Feb 13, 2025')).toBeInTheDocument();
  });

  test('Should render the date when the course take couple months', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          classes: {
            allClasses: {
              data: [
                {
                  ...stateMock.classes.allClasses.data[0],
                  startDate: '2024-02-13T17:42:22Z',
                  endDate: '2024-03-13T17:42:22Z',
                },
              ],
            },
          },
        },
      },
    );

    expect(getByText('Feb 13 - Mar 13, 2024')).toBeInTheDocument();
  });

  test('Should render the date when the course take one single month', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          classes: {
            allClasses: {
              data: [
                {
                  ...stateMock.classes.allClasses.data[0],
                  startDate: '2024-02-13T17:42:22Z',
                  endDate: '2024-02-20T17:42:22Z',
                },
              ],
            },
          },
        },
      },
    );

    expect(getByText('Feb 13-20, 2024')).toBeInTheDocument();
  });

  test('Should render enrollment info with 1 seat remaining', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
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
        },
      },
    );

    expect(getByText('3 enrolled, 1 seat remaining')).toBeInTheDocument();
  });

  test('Should render enrollment info with more than 1 seat remaining', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1')}`]}>
        <Route path="/courses/:courseId/:classId">
          <InstructorCard isOpen onClose={() => { }} />
        </Route>
      </MemoryRouter>,
      {
        preloadedState: {
          classes: {
            allClasses: {
              data: [
                {
                  ...stateMock.classes.allClasses.data[0],
                  purchasedSeats: 10,
                },
              ],
            },
          },
        },
      },
    );

    expect(getByText('3 enrolled, 7 seats remaining')).toBeInTheDocument();
  });
});
