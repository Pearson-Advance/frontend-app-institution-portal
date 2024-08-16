import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import { renderWithProviders } from 'test-utils';
import { RequestStatus } from 'features/constants';

import ManageInstructors from 'features/Instructors/ManageInstructors';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
  instructors: {
    table: {
      data: [{
        instructorEmail: 'instructor01@example.com',
        instructorName: 'Instructor 1',
        instructorUsername: 'Instructor01',
        classes: 1,
        courses: ['Demo Course'],
        lastAcess: '2023-11-29T02:17:41.213175Z',
      },
      {
        instructorUsername: 'Instructor02',
        instructorName: 'Instructor 2',
        instructorEmail: 'instructor02@example.com',
        classes: 1,
        courses: ['Demo Course'],
        lastAcess: '2023-10-04T15:02:17.016088Z',
      }],
    },
    rowsSelected: [],
    selectOptions: {
      status: RequestStatus.SUCCESS,
      data: [{
        instructorEmail: 'instructor01@example.com',
        instructorName: 'Instructor 1',
        instructorUsername: 'Instructor01',
        classes: 1,
        courses: ['Demo Course'],
        lastAcess: '2023-11-29T02:17:41.213175Z',
      },
      {
        instructorUsername: 'Instructor02',
        instructorName: 'Instructor 2',
        instructorEmail: 'instructor02@example.com',
        classes: 1,
        courses: ['Demo Course'],
        lastAcess: '2023-10-04T15:02:17.016088Z',
      }],
    },
    assignInstructors: {
      data: [],
      status: RequestStatus.INITIAL,
    },
  },
};

describe('Manage instructors page', () => {
  test('render page', async () => {
    const { getByText, getAllByRole, getByTestId } = renderWithProviders(
      <MemoryRouter initialEntries={[`/manageInstructors/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1:XXX+YYY+2023+ccx@111')}`]}>
        <Route path="/manageInstructors/:courseId/:classId">
          <ManageInstructors />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(getByText('Manage Instructors')).toBeInTheDocument();
      expect(getByText('Instructor')).toBeInTheDocument();
      expect(getByText('Instructor1')).toBeInTheDocument();
      expect(getByText('Instructor2')).toBeInTheDocument();
      expect(getByText('Last seen')).toBeInTheDocument();
      expect(getByText('Courses taught')).toBeInTheDocument();
    });

    const checkboxFields = getAllByRole('checkbox');
    fireEvent.click(checkboxFields[0]);

    const assignButton = getByTestId('assignButton');
    fireEvent.click(assignButton);
  });

  test('Delete instructor', async () => {
    const { getByText, getAllByTestId } = renderWithProviders(
      <MemoryRouter initialEntries={[`/manageInstructors/${encodeURIComponent('course-v1:XXX+YYY+2023')}/${encodeURIComponent('ccx-v1:XXX+YYY+2023+ccx@111')}`]}>
        `/courses/${encodeURIComponent('course-v1:XXX+YYY+2023')}`
        <Route path="/manageInstructors/:courseId/:classId">
          <ManageInstructors />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const deleteIcons = getAllByTestId('delete-icon');
    fireEvent.click(deleteIcons[0]);
    waitFor(() => {
      expect(getByText('Delete')).toBeInTheDocument();
    });
  });
});
