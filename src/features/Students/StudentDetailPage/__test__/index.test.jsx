import React from 'react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import { RequestStatus } from 'features/constants';
import StudentsDetailsPage from 'features/Students/StudentDetailPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: { username: 'instructor123' },
  students: {
    studentProfile: {
      learnerName: 'student123',
      learnerEmail: 'student123@example.com',
      courseId: 'course-v1:demo+demo1+2020',
      courseName: 'Demo Course 1',
      classId: 'ccx-v1:demo+demo1+2020+ccx@4',
      className: 'Events and Event-Driven Architecture 2',
      created: '2024-02-13T17:56:08.646779Z',
      examReady: false,
      startDate: '2024-08-01T00:00:00Z',
      endDate: '2024-08-29T00:00:00Z',
      lastAccess: '2024-02-13 18:51:38.916464',
      completePercentage: 0,
      userImageUrl: '/static/images/profiles/default_500.png',
      status: RequestStatus.INITIAL,
    },
  },
};

describe('StudentsDetails', () => {
  test('Should render the options', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/students/student123%40example.com']}>
        <Route path="/students/:studentEmail">
          <StudentsDetailsPage />,
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(getByText('Student')).toBeInTheDocument();
      expect(getByText('student123')).toBeInTheDocument();
      expect(getByText('student123@example.com')).toBeInTheDocument();
      expect(getByText('recent courses taken')).toBeInTheDocument();
      expect(getByText('events and event-driven architecture 2')).toBeInTheDocument();
      expect(getByText('student since')).toBeInTheDocument();
      expect(getByText('02/13/24')).toBeInTheDocument();
    });
  });
});
