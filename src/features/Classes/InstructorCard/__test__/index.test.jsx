import React from 'react';
import { renderWithProviders } from 'test-utils';
import '@testing-library/jest-dom/extend-expect';

import InstructorCard from 'features/Classes/InstructorCard';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({
    courseId: 'Demo course',
    classId: 'demo class',
  })),
  useLocation: jest.fn().mockReturnValue({ search: '?classId=demo class' }),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const stateMock = {
  classes: {
    allClasses: {
      data: [{
        startDate: '2024-02-13T17:42:22Z',
        classId: 'demo+class',
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
      <InstructorCard isOpen onClose={() => { }} />,
      { preloadedState: stateMock },
    );

    expect(getByText('Demo course')).toBeInTheDocument();
    expect(getByText('demo class')).toBeInTheDocument();
    expect(getByText('Sam Sepiol')).toBeInTheDocument();
    expect(getByText('Feb 13, 2024')).toBeInTheDocument();
  });

  test('Should render multiple instructors', () => {
    const { getByText } = renderWithProviders(
      <InstructorCard isOpen onClose={() => { }} />,
      {
        preloadedState: {
          classes: {
            allClasses: {
              data: [
                {
                  ...stateMock.classes.allClasses.data[0],
                  instructors: ['Sam Sepiol', 'Aldo Pearson', 'lionel messi'],
                },
              ],
            },
          },
        },
      },
    );

    expect(getByText(/more\.\.\./)).toBeInTheDocument();
  });

  test('Should render both dates when the duration is to loong', () => {
    const { getByText } = renderWithProviders(
      <InstructorCard isOpen onClose={() => { }} />,
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
      <InstructorCard isOpen onClose={() => { }} />,
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
      <InstructorCard isOpen onClose={() => { }} />,
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
});
