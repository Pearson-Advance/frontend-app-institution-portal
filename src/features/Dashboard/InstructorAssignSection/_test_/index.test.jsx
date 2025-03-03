import React from 'react';
import InstructorAssignSection from 'features/Dashboard/InstructorAssignSection';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('Instructor Assign component', () => {
  const mockStore = {
    dashboard: {
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
    },
  };
  const component = renderWithProviders(
    <InstructorAssignSection />,
    { preloadedState: mockStore },
  );

  test('renders components', () => {
    const { getByText, getAllByText } = component;

    expect(getByText('Instructor assignment')).toBeInTheDocument();
    expect(getAllByText('ccx 1')[0]).toBeInTheDocument();
    expect(getAllByText('Demo Course 1')[0]).toBeInTheDocument();
    expect(getAllByText('Jan 23, 2024')[0]).toBeInTheDocument();
    expect(getByText('Manage instructor')).toBeInTheDocument();
  });
});
