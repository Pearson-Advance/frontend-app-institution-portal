import React from 'react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { MemoryRouter, Route } from 'react-router-dom';

import InstructorsDetailPage from 'features/Instructors/InstructorsDetailPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: {
    selectedInstitution: {
      id: 1,
      name: 'Institution 1',
      shortName: 'Test',
      active: true,
      externalId: '',
      created: '2023-06-22T22:48:56.124907Z',
      modified: '2023-06-22T22:48:56.124907Z',
      label: 'Institution 1',
      value: 1,
    },
  },
  classes: {
    table: {
      data: [
        {
          className: 'Demo Class 1',
          masterCourseName: 'Demo MaterCourse 1',
          startDate: '2024-08-15',
          endDate: '2026-08-15',
          status: 'pending',
        },
        {
          className: 'Demo Class 2',
          masterCourseName: 'Demo MaterCourse 2',
          startDate: '2024-08-15',
          endDate: '2027-08-15',
          status: 'complete',
        },
        {
          className: 'Demo Class 3',
          masterCourseName: 'Demo MaterCourse 3',
          startDate: '2020-08-15',
          endDate: '2022-08-15',
          status: 'in progress',
        },
      ],
      count: 3,
      num_pages: 1,
      current_page: 1,
    },
  },
  instructors: {
    table: {
      data: [
        {
          instructorUsername: 'instructor',
          instructorName: 'Instructor 1',
          instructorEmail: 'instructor1@example.com',
          ccxId: 'CCX1',
          ccxName: 'CCX 1',
        },
      ],
      count: 1,
      num_pages: 1,
      current_page: 1,
    },
  },
};

describe('InstructorsDetailPage', () => {
  test('renders classes data and pagination', async () => {
    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/instructors/instructor']}>
        <Route path="/instructors/:instructorUsername">
          <InstructorsDetailPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Demo Class 1');
      expect(component.container).toHaveTextContent('Demo Class 2');
      expect(component.container).toHaveTextContent('Demo Class 3');
      expect(component.container).toHaveTextContent('Demo MaterCourse 1');
      expect(component.container).toHaveTextContent('Demo MaterCourse 2');
      expect(component.container).toHaveTextContent('Demo MaterCourse 3');
      expect(component.container).toHaveTextContent('08/15/23 - 08/15/26');
      expect(component.container).toHaveTextContent('08/15/24 - 08/15/27');
      expect(component.container).toHaveTextContent('08/15/20 - 08/15/22');
      expect(component.container).toHaveTextContent('pending');
      expect(component.container).toHaveTextContent('complete');
      expect(component.container).toHaveTextContent('in progress');
    });
  });
});
