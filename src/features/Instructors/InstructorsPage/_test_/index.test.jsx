import React from 'react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { MemoryRouter, Route } from 'react-router-dom';

import InstructorsPage from 'features/Instructors/InstructorsPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  instructors: {
    table: {
      data: [
        {
          instructorUsername: 'Instructor1',
          instructorName: 'Instructor 1',
          instructorEmail: 'instructor1@example.com',
          ccxId: 'CCX1',
          ccxName: 'CCX 1',
        },
        {
          instructorUsername: 'Instructor2',
          instructorName: 'Instructor 2',
          instructorEmail: 'instructor2@example.com',
          ccxId: 'CCX2',
          ccxName: 'CCX 2',
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
    classes: {
      data: [],
    },
    courses: {
      data: [],
    },
  },
};

describe('InstructorPage', () => {
  test('render instructor page', () => {
    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/instructors']}>
        <Route path="/instructors">
          <InstructorsPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Instructor1');
      expect(component.container).toHaveTextContent('Instructor2');
      expect(component.container).toHaveTextContent('Instructor 1');
      expect(component.container).toHaveTextContent('Instructor 2');
      expect(component.container).toHaveTextContent('instructor1@example.com');
      expect(component.container).toHaveTextContent('instructor2@example.com');
      expect(component.container).toHaveTextContent('CCX1');
      expect(component.container).toHaveTextContent('CCX 2');
    });
  });
});
