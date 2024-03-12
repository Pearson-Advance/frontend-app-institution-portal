import React from 'react';
import { waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';

import { renderWithProviders } from 'test-utils';

import ClassPage from 'features/Classes/Class/ClassPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
  students: {
    table: {
      next: null,
      previous: null,
      count: 1,
      numPages: 1,
      currentPage: 1,
      start: 0,
      results: [
        {
          learnerName: 'Test User',
          learnerEmail: 'testuser@example.com',
          courseId: 'course-v1:demo+demo1+2020',
          courseName: 'Demo Course 1',
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          className: 'test ccx1',
          created: '2024-02-13T18:31:27.399407Z',
          status: 'Active',
          examReady: false,
          startDate: '2024-02-13T17:42:22Z',
          endDate: null,
          completePercentage: 0.0,
        },
      ],
    },
  },
};

describe('ClassesPage', () => {
  test('renders classes data and pagination', async () => {
    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201/demo%20class%20cxx1']}>
        <Route path="/courses/:courseId/:classId">
          <IntlProvider locale="en">
            <ClassPage />
          </IntlProvider>
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Class details: demo class cxx1');
      expect(component.container).toHaveTextContent('No');
      expect(component.container).toHaveTextContent('Student');
      expect(component.container).toHaveTextContent('Email');
      expect(component.container).toHaveTextContent('Status');
      expect(component.container).toHaveTextContent('Courseware Progress');
      expect(component.container).toHaveTextContent('Exam ready');
      expect(component.container).toHaveTextContent('Invite student to enroll');
    });
  });
});
