import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

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
          courseId: 'course-v1:XXX+YYY+2023',
          courseName: 'Demo Course 1',
          classId: 'ccx-v1:XXX+YYY+2023+ccx@111',
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
  test('Should render classes data and pagination', async () => {
    const component = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1:XXX+YYY+2023+ccx@111')}`]}>
        <Route path="/courses/:courseId/:classId">
          <ClassPage />
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

  test('Should render actions', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <MemoryRouter initialEntries={[`/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1:XXX+YYY+2023+ccx@111')}`]}>
        <Route path="/courses/:courseId/:classId">
          <ClassPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(getByText('Invite student to enroll')).toBeInTheDocument();

      const button = getByTestId('droprown-action');
      fireEvent.click(button);

      expect(getByText('Class content')).toBeInTheDocument();
      expect(getByText('Assign instructor')).toBeInTheDocument();
      expect(getByText('Edit Class')).toBeInTheDocument();
      expect(getByText('Delete Class')).toBeInTheDocument();
      expect(getByText('Gradebook')).toBeInTheDocument();
      expect(getByText('Lab summary')).toBeInTheDocument();
    });
  });
});
