import React from 'react';
import { waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { MemoryRouter, Route } from 'react-router-dom';

import InstructorsPage from 'features/Instructors/InstructorsPage';
import { RequestStatus, INSTRUCTOR_STATUS_TABS } from 'features/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Instructors/data/thunks', () => ({
  fetchInstructorsData: (institutionId, currentPage, filters) => async (dispatch) => {
    let filteredData = [];

    if (filters?.active === true) {
      filteredData = [
        {
          instructorUsername: 'Instructor1',
          instructorName: 'Instructor 1',
          instructorEmail: 'instructor1@example.com',
          ccxId: 'CCX1',
          ccxName: 'CCX 1',
          active: true,
        },
      ];
    } else if (filters?.active === false) {
      filteredData = [
        {
          instructorUsername: 'Instructor2',
          instructorName: 'Instructor 2',
          instructorEmail: 'instructor2@example.com',
          ccxId: 'CCX2',
          ccxName: 'CCX 2',
          active: false,
        },
      ];
    } else {
      filteredData = [
        {
          instructorUsername: 'Instructor1',
          instructorName: 'Instructor 1',
          instructorEmail: 'instructor1@example.com',
          ccxId: 'CCX1',
          ccxName: 'CCX 1',
          active: true,
        },
        {
          instructorUsername: 'Instructor2',
          instructorName: 'Instructor 2',
          instructorEmail: 'instructor2@example.com',
          ccxId: 'CCX2',
          ccxName: 'CCX 2',
          active: false,
        },
      ];
    }

    // dispatch the real slice success action
    dispatch({
      type: 'instructors/fetchInstructorsDataSuccess',
      payload: {
        results: filteredData,
        count: filteredData.length,
        numPages: 1,
      },
    });
  },
}));
const baseStore = {
  main: {
    selectedInstitution: { id: 1 },
  },
  instructors: {
    table: {
      data: [],
      count: 0,
      num_pages: 1,
      current_page: 1,
    },
    classes: { data: [] },
    courses: { data: [] },
    instructorForm: {
      status: RequestStatus.INITIAL,
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
      { preloadedState: baseStore },
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('Instructor1');
      expect(component.container).toHaveTextContent('Instructor2');
      expect(component.container).toHaveTextContent('Instructor 1');
      expect(component.container).toHaveTextContent('Instructor 2');
      expect(component.container).toHaveTextContent('instructor1@example.com');
      expect(component.container).toHaveTextContent('instructor2@example.com');
    });
  });

  test('shows only active instructors when "Active" tab is clicked', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/instructors']}>
        <Route path="/instructors">
          <InstructorsPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: baseStore },
    );

    fireEvent.click(screen.getByRole('tab', { name: INSTRUCTOR_STATUS_TABS.ACTIVE }));

    expect(screen.getByText('Instructor 1')).toBeInTheDocument();
  });

  test('shows only inactive instructors when "Inactive" tab is clicked', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/instructors']}>
        <Route path="/instructors">
          <InstructorsPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: baseStore },
    );

    fireEvent.click(screen.getByRole('tab', { name: INSTRUCTOR_STATUS_TABS.INACTIVE }));

    expect(screen.getByText('Instructor 2')).toBeInTheDocument();
  });
});
