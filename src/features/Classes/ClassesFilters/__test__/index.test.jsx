import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, act } from '@testing-library/react';

import { initializeMockApp } from '@edx/frontend-platform/testing';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { renderWithProviders } from 'test-utils';

import ClassesFilters from 'features/Classes/ClassesFilters';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({})),
  useLocation: jest.fn().mockReturnValue({}),
}));

let axiosMock;

const courseOption = {
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
    selectOptions: [instructorOption],
    filters: {},
  },
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
};

jest.mock('react-select', () => function reactSelect({ options, currentValue, onChange }) {
  function handleChange(event) {
    const currentOption = options.find(
      (option) => option.value === event.currentTarget.value,
    );
    onChange(currentOption);
  }

  return (
    <select data-testid="select" value={currentValue} onChange={handleChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

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
      const { getByText, getAllByTestId } = renderWithProviders(
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
    const { getByText, getAllByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const buttonClearFilters = getByText('Reset');

    expect(courseSelect).toBeInTheDocument();
    expect(courseSelect).toBeInTheDocument();

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    await act(async () => {
      fireEvent.click(buttonClearFilters);
    });
  });
});
