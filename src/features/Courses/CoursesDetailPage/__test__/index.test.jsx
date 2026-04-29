import { waitFor, fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { RequestStatus } from 'features/constants';
import { fetchClassesData } from 'features/Classes/data/thunks';

import { renderWithProviders } from 'test-utils';
import CoursesDetailPage from 'features/Courses/CoursesDetailPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Classes/data/thunks', () => ({
  fetchClassesData: jest.fn(() => () => Promise.resolve()),
}));

jest.mock('helpers', () => ({
  ...jest.requireActual('helpers'),
  getDefaultDates: jest.fn(() => ({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  })),
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
  instructors: {
    selectOptions: { data: [] },
    table: {
      data: [],
      count: 0,
      num_pages: 1,
      current_page: 1,
    },
  },
  courses: {
    newClass: { status: RequestStatus.INITIAL },
    table: {
      data: [
        {
          masterCourseName: 'Demo Course 1',
          numberOfClasses: 3,
          missingClassesForInstructor: 0,
          numberOfStudents: 3,
          numberOfPendingStudents: 0,
        },
        {
          masterCourseName: 'Demo Course 2',
          numberOfClasses: 3,
          missingClassesForInstructor: 0,
          numberOfStudents: 3,
          numberOfPendingStudents: 0,
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
    selectOptions: [
      {
        masterCourseName: 'Demo Course 1',
        numberOfClasses: 3,
        missingClassesForInstructor: 0,
        numberOfStudents: 3,
        numberOfPendingStudents: 0,
      },
      {
        masterCourseName: 'Demo Course 2',
        numberOfClasses: 3,
        missingClassesForInstructor: 0,
        numberOfStudents: 3,
        numberOfPendingStudents: 0,
      },
    ],
  },
  classes: {
    table: {
      data: [
        {
          masterCourseName: 'Demo MasterCourse 1',
          className: 'Demo Class 1',
          startDate: '2024-09-21',
          endDate: null,
          numberOfStudents: 1,
          maxStudents: 100,
          instructors: ['instructor_1'],
        },
        {
          masterCourseName: 'Demo MasterCourse 2',
          className: 'Demo Class 2',
          startDate: '2025-09-21',
          endDate: null,
          numberOfStudents: 2,
          maxStudents: 200,
          instructors: ['instructor_2'],
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    },
    allClasses: {
      data: [
        {
          masterCourseName: 'Demo MasterCourse 1',
          className: 'Demo Class 1',
          startDate: '2024-09-21',
          endDate: null,
          numberOfStudents: 1,
          maxStudents: 100,
          instructors: ['instructor_1'],
        },
        {
          masterCourseName: 'Demo MasterCourse 2',
          className: 'Demo Class 2',
          startDate: '2025-09-21',
          endDate: null,
          numberOfStudents: 2,
          maxStudents: 200,
          instructors: ['instructor_2'],
        },
      ],
    },
  },
};

const route = '/courses/course-v1:XXX+YYY+2023';

const renderComponent = (store = mockStore) => renderWithProviders(
  <Route path="/courses/:courseId" element={<CoursesDetailPage />} />,
  {
    preloadedState: store,
    initialEntries: [route],
  },
);

describe('CoursesDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should render the table and the course info', async () => {
    const { container } = renderComponent();

    waitFor(() => {
      expect(container).toHaveTextContent('Demo Course 1 1');
      expect(container).toHaveTextContent('Demo MasterCourse 1');
      expect(container).toHaveTextContent('Demo MasterCourse 2');
      expect(container).toHaveTextContent('Demo Class 1');
      expect(container).toHaveTextContent('Demo Class 2');
      expect(container).toHaveTextContent('09/21/24');
      expect(container).toHaveTextContent('09/21/25');
      expect(container).toHaveTextContent('1');
      expect(container).toHaveTextContent('2');
      expect(container).toHaveTextContent('100');
      expect(container).toHaveTextContent('200');
      expect(container).toHaveTextContent('instructor_1');
      expect(container).toHaveTextContent('instructor_2');
    });
  });

  test('Should render the class name filter input', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('class_name')).toBeInTheDocument();
  });

  test('Should render the start date and end date filter inputs', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('start_date')).toBeInTheDocument();
    expect(getByTestId('end_date')).toBeInTheDocument();
  });

  test('Apply and Reset buttons should be disabled when no filter has changed', () => {
    const { getByText } = renderComponent();
    expect(getByText('Apply')).toBeDisabled();
    expect(getByText('Reset')).toBeDisabled();
  });

  test('Apply and Reset buttons should be enabled when class name has valid value', () => {
    const { getByTestId, getByText } = renderComponent();

    fireEvent.change(getByTestId('class_name'), {
      target: { value: 'Demo Class' },
    });

    expect(getByText('Apply')).not.toBeDisabled();
    expect(getByText('Reset')).not.toBeDisabled();
  });

  test('Apply and Reset buttons should remain disabled when class name has less than 2 chars and dates are default', () => {
    const { getByTestId, getByText } = renderComponent();

    fireEvent.change(getByTestId('class_name'), { target: { value: 'D' } });

    expect(getByText('Apply')).toBeDisabled();
    expect(getByText('Reset')).toBeDisabled();
  });

  test('Apply and Reset buttons should be enabled when start_date changes from default', () => {
    const { getByTestId, getByText } = renderComponent();

    fireEvent.change(getByTestId('start_date'), { target: { value: '2023-06-01' } });

    expect(getByText('Apply')).not.toBeDisabled();
    expect(getByText('Reset')).not.toBeDisabled();
  });

  test('Apply and Reset buttons should be enabled when end_date changes from default', () => {
    const { getByTestId, getByText } = renderComponent();

    fireEvent.change(getByTestId('end_date'), { target: { value: '2025-03-15' } });

    expect(getByText('Apply')).not.toBeDisabled();
    expect(getByText('Reset')).not.toBeDisabled();
  });

  test('Should dispatch fetchClassesData with class_name filter on Apply', async () => {
    const { getByTestId, getByText } = renderComponent();

    fireEvent.change(getByTestId('class_name'), {
      target: { value: 'Demo Class' },
    });

    fireEvent.click(getByText('Apply'));

    await waitFor(() => {
      expect(fetchClassesData).toHaveBeenCalledWith(
        1,
        1,
        'course-v1:XXX+YYY+2023',
        expect.objectContaining({ class_name: 'Demo Class' }),
      );
    });
  });

  test('Should clear all filters and refetch', async () => {
    const { getByTestId, getByText } = renderComponent();

    fireEvent.change(getByTestId('class_name'), { target: { value: 'Demo Class' } });
    fireEvent.change(getByTestId('start_date'), { target: { value: '2023-06-01' } });
    fireEvent.change(getByTestId('end_date'), { target: { value: '2023-12-31' } });
    fireEvent.click(getByText('Reset'));

    await waitFor(() => {
      expect(getByTestId('class_name')).toHaveValue('');
      expect(getByTestId('start_date')).toHaveValue('');
      expect(getByTestId('end_date')).toHaveValue('');

      expect(fetchClassesData).toHaveBeenLastCalledWith(
        1,
        1,
        'course-v1:XXX+YYY+2023',
        expect.objectContaining({}),
      );
    });
  });

  test('Should disable Apply and Reset buttons after Reset', async () => {
    const { getByTestId, getByText } = renderComponent();

    fireEvent.change(getByTestId('class_name'), {
      target: { value: 'Demo Class' },
    });

    fireEvent.click(getByText('Reset'));

    await waitFor(() => {
      expect(getByText('Apply')).toBeDisabled();
      expect(getByText('Reset')).toBeDisabled();
    });
  });
});
