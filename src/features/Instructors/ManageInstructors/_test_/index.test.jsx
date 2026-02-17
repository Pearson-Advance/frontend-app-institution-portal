import { waitFor, fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';

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

const courseId = encodeURIComponent('course-v1:XXX+YYY+2023');
const classId = encodeURIComponent('ccx-v1:XXX+YYY+2023+ccx@111');

describe('Manage instructors page', () => {
  test('render page', async () => {
    const { getByText, getAllByRole, getByTestId } = rrenderWithProviders(
      <Route
        path="/manageInstructors/:courseId/:classId"
        element={<ManageInstructors />}
      />,
      {
        preloadedState: mockStore,
        initialEntries: [`/manageInstructors/${courseId}/${classId}`],
      },
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
      <Route
        path="/manageInstructors/:courseId/:classId"
        element={<ManageInstructors />}
      />,
      {
        preloadedState: mockStore,
        initialEntries: [`/manageInstructors/${courseId}/${classId}`],
      },
    );

    const deleteIcons = getAllByTestId('delete-icon');
    fireEvent.click(deleteIcons[0]);
    waitFor(() => {
      expect(getByText('Delete')).toBeInTheDocument();
    });
  });
});
