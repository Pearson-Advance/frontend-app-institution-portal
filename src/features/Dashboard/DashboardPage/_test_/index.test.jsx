import React from 'react';
import DashboardPage from 'features/Dashboard/DashboardPage';
import { renderWithProviders } from 'test-utils';
import { Route } from 'react-router-dom';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('DashboardPage component', () => {
  const mockStore = {
    dashboard: {
      tableLicense: {
        data: [
          {
            licenseName: 'License Name 1',
            purchasedSeats: 20,
            numberOfStudents: 6,
            numberOfPendingStudents: 11,
          },
        ],
      },
      classesNoInstructors: {
        data: [
          {
            classId: 'ccx-v1:demo+demo1+2020+ccx1',
            className: 'ccx 1',
            masterCourseName: 'Demo Course 1',
            instructors: [],
            numberOfStudents: 0,
            numberOfPendingStudents: 0,
            maxStudents: 20,
            startDate: '2024-01-23T21:50:51Z',
            endDate: null,
          },
        ],
      },
      classes: {
        data: [
          {
            classId: 'ccx-v1:demo+demo1+2020+ccx2',
            className: 'ccx 2',
            masterCourseName: 'Demo Course 1',
            instructors: [],
            numberOfStudents: 0,
            numberOfPendingStudents: 0,
            maxStudents: 20,
            startDate: '2024-01-23T21:50:51Z',
            endDate: null,
          },
        ],
      },
    },
  };

  const component = renderWithProviders(
    <Route path="/dashboard" element={<DashboardPage />} />,
    {
      preloadedState: mockStore,
      initialEntries: ['/dashboard'],
    },
  );

  test('renders components', () => {
    const { getByText, getAllByText } = component;

    expect(getByText('This week')).toBeInTheDocument();
    expect(getByText('Last month')).toBeInTheDocument();
    expect(getByText('Last quarter')).toBeInTheDocument();
    expect(getByText('New students registered')).toBeInTheDocument();
    expect(getByText('Classes scheduled')).toBeInTheDocument();
    expect(getByText('License inventory')).toBeInTheDocument();
    expect(getByText('Instructor assignment')).toBeInTheDocument();
    expect(getAllByText('ccx 1')[0]).toBeInTheDocument();
    expect(getAllByText('Demo Course 1')[0]).toBeInTheDocument();
    expect(getByText('License Name 1')).toBeInTheDocument();
    expect(getByText('Class schedule')).toBeInTheDocument();
    expect(getByText('No classes scheduled at this time')).toBeInTheDocument();
  });
});
