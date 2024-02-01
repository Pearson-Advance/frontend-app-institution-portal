import React from 'react';
import WeeklySchedule from 'features/Dashboard/WeeklySchedule';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('WeeklySchedule component', () => {
  const mockStore = {
    dashboard: {
      classes: {
        data: [
          {
            classId: 'ccx-v1:demo+demo1+2020+ccx1',
            className: 'ccx 1',
            masterCourseName: 'Demo Course 1',
            instructors: [
              'instructor1',
            ],
            numberOfStudents: 0,
            numberOfPendingStudents: 0,
            maxStudents: 20,
            startDate: '2024-01-23T21:50:51Z',
            endDate: null,
          },
          {
            classId: 'ccx-v1:demo+demo1+2020+ccx2',
            className: 'ccx 2',
            masterCourseName: 'Demo Course 1',
            instructors: [
              'instructor1',
            ],
            numberOfStudents: 0,
            numberOfPendingStudents: 0,
            maxStudents: 20,
            startDate: '2023-10-02T12:58:43Z',
            endDate: null,
          },
        ],
      },
    },
  };
  const component = renderWithProviders(
    <WeeklySchedule />,
    { preloadedState: mockStore },
  );

  test('renders components', () => {
    const { getByText } = component;

    expect(getByText('Class schedule')).toBeInTheDocument();
    expect(getByText('ccx 1')).toBeInTheDocument();
    expect(getByText('Jan 23, 2024')).toBeInTheDocument();
    expect(getByText('ccx 2')).toBeInTheDocument();
    expect(getByText('Oct 2, 2023')).toBeInTheDocument();
  });
});
