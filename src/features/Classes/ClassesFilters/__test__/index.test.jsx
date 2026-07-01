/* eslint-disable react/prop-types */
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, act } from '@testing-library/react';

import { initializeMockApp } from '@edx/frontend-platform/testing';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { renderWithProviders } from 'test-utils';

import ClassesFilters from 'features/Classes/ClassesFilters';
import { useGetCoursesOptionsQuery } from 'features/Courses/data/coursesApi';
import { useGetInstructorsOptionsQuery } from 'features/Instructors/data/instructorsApi';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({})),
  useLocation: jest.fn(() => ({})),
}));

jest.mock('features/Courses/data/coursesApi', () => ({
  ...jest.requireActual('features/Courses/data/coursesApi'),
  useGetCoursesOptionsQuery: jest.fn(),
}));

jest.mock('features/Instructors/data/instructorsApi', () => ({
  ...jest.requireActual('features/Instructors/data/instructorsApi'),
  useGetInstructorsOptionsQuery: jest.fn(),
}));

let axiosMock;

const courseOption = {
  masterCourseId: 1,
  masterCourseName: 'Demo Course 1',
  numberOfClasses: 1,
  missingClassesForInstructor: null,
  numberOfStudents: 1,
  numberOfPendingStudents: 1,
};

const instructorOption = {
  instructorName: 'Sam Sepiol',
  instructorUsername: 's4mS3pi0l',
  instructorEmail: 'sam@example.com',
};

const coursesMockResponse = {
  results: [courseOption],
  count: 1,
  num_pages: 1,
  current_page: 1,
};

const instructorMockResponse = {
  results: [instructorOption],
  count: 1,
  num_pages: 1,
  current_page: 1,
};

const mockStore = {
  courses: {
    table: {
      currentPage: 1,
      data: [courseOption],
      status: 'success',
    },
    selectOptions: [courseOption],
    filters: {},
  },
  instructors: {
    table: {
      currentPage: 1,
      data: [courseOption],
      status: 'success',
    },
    selectOptions: {
      data: [instructorOption],
      status: 'success',
    },
    filters: {},
  },
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
};

jest.mock('react-paragon-topaz', () => ({
  Select: ({
    options = [], value, onChange, name,
  }) => (
    <select
      data-testid="select"
      name={name}
      value={value?.value || ''}
      onChange={(e) => {
        const selected = options.find(opt => String(opt.value) === e.target.value);
        onChange(selected);
      }}
    >
      <option value="">--</option>
      {options.map(({ label, valueSelect }) => (
        <option key={valueSelect} value={valueSelect}>
          {label}
        </option>
      ))}
    </select>
  ),
  Button: ({ children, type = 'button', ...props }) => (
    // eslint-disable-next-line react/button-has-type
    <button {...props} type={type}>
      {children}
    </button>
  ),
}));

describe('ClassesFilters Component', () => {
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 1,
        username: 'edx',
        administrator: true,
        roles: [],
      },
    });

    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    mockSetFilters.mockClear();

    useGetCoursesOptionsQuery.mockReturnValue({
      data: [courseOption],
      isFetching: false,
    });
    useGetInstructorsOptionsQuery.mockReturnValue({
      data: [instructorOption],
      isFetching: false,
    });

    const coursesApiUrl = `
    ${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=false&institution_id=1&page=1`;
    const instructorApiUrl = `
    ${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/?page=1&institution_id=1&limit=false`;

    axiosMock.onGet(coursesApiUrl)
      .reply(200, coursesMockResponse);

    axiosMock.onGet(instructorApiUrl)
      .reply(200, instructorMockResponse);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test(
    'The <Apply> button should be disabled if there is no selection in any filter, then it will be available if the user selects an option',
    () => {
      const resetPagination = jest.fn();
      const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
        <ClassesFilters resetPagination={resetPagination} />,
        { preloadedState: mockStore },
      );

      const buttonApplyFilters = getByText('Apply');
      expect(buttonApplyFilters).toHaveAttribute('disabled');

      const instructorSelect = getAllByTestId('select')[1];

      fireEvent.change(instructorSelect, {
        target: { value: 's4mS3pi0l' },
      });

      expect(buttonApplyFilters).not.toBeDisabled();

      const classInput = getByTestId('class_name');
      fireEvent.change(classInput, {
        target: { value: 'ab' },
      });

      expect(buttonApplyFilters).not.toBeDisabled();
    },
  );

  test('Should call the service when apply filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getAllByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const instructorSelect = getAllByTestId('select')[1];
    const buttonApplyFilters = getByText('Apply');

    expect(courseSelect).toBeInTheDocument();
    expect(instructorSelect).toBeInTheDocument();

    fireEvent.change(instructorSelect, {
      target: { value: 'Sam Sepiol' },
    });

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    expect(getByText('Sam Sepiol')).toBeInTheDocument();
    expect(getByText('Demo Course 1')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('Should clear the filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const classInput = getByTestId('class_name');
    const startDateInput = getByTestId('start_date');
    const endDateInput = getByTestId('end_date');
    const buttonClearFilters = getByText('Reset');

    expect(courseSelect).toBeInTheDocument();

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    fireEvent.change(classInput, {
      target: { value: 'test' },
    });

    fireEvent.change(startDateInput, {
      target: { value: '2024-01-01' },
    });

    fireEvent.change(endDateInput, {
      target: { value: '2024-07-31' },
    });

    await act(async () => {
      fireEvent.click(buttonClearFilters);
    });

    expect(classInput).toHaveValue('');
    expect(startDateInput).toHaveValue('');
    expect(endDateInput).toHaveValue('');
  });

  test('Should apply filters including dates', async () => {
    const resetPagination = jest.fn();
    const { getByText, getByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const startDateInput = getByTestId('start_date');
    const endDateInput = getByTestId('end_date');
    const buttonApply = getByText('Apply');

    fireEvent.change(startDateInput, {
      target: { value: '2024-01-01' },
    });

    fireEvent.change(endDateInput, {
      target: { value: '2024-02-01' },
    });

    await act(async () => {
      fireEvent.click(buttonApply);
    });

    expect(buttonApply).toBeInTheDocument();
  });

  test('Should restore previously applied filter values from state', () => {
    const resetPagination = jest.fn();
    const preloadedState = {
      ...mockStore,
      classes: {
        filtersForm: {
          classFilter: 'Persisted class',
          courseSelected: null,
          instructorSelected: null,
          startDate: '2024-01-01',
          endDate: '2024-02-01',
        },
      },
    };

    const { getByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState },
    );

    expect(getByTestId('class_name')).toHaveValue('Persisted class');
    expect(getByTestId('start_date')).toHaveValue('2024-01-01');
    expect(getByTestId('end_date')).toHaveValue('2024-02-01');
  });

  test('Should persist filter form values in state when applying', async () => {
    const resetPagination = jest.fn();
    const { getByText, getByTestId, store } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    fireEvent.change(getByTestId('class_name'), {
      target: { value: 'My class' },
    });

    await act(async () => {
      fireEvent.click(getByText('Apply'));
    });

    expect(store.getState().classes.filtersForm.classFilter).toBe('My class');
  });

  test('Should reset the persisted filter form when cleaning filters', async () => {
    const resetPagination = jest.fn();
    const preloadedState = {
      ...mockStore,
      classes: {
        filtersForm: {
          classFilter: 'Persisted class',
          courseSelected: null,
          instructorSelected: null,
          startDate: '',
          endDate: '',
        },
      },
    };

    const { getByText, getByTestId, store } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState },
    );

    expect(getByTestId('class_name')).toHaveValue('Persisted class');

    await act(async () => {
      fireEvent.click(getByText('Reset'));
    });

    expect(store.getState().classes.filtersForm).toEqual({});
    expect(getByTestId('class_name')).toHaveValue('');
  });
});
