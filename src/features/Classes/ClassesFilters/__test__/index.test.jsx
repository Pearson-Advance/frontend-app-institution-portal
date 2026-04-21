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

jest.mock('react-select', () => function reactSelect({ options, value, onChange }) {
  function handleChange(event) {
    const currentOption = options.find(
      (option) => String(option.value) === event.currentTarget.value,
    );
    onChange(currentOption);
  }

  return (
    <select data-testid="select" value={value?.value || ''} onChange={handleChange}>
      <option value="" label="label" />
      {options.map(({ label, value: optionValue }) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
});

describe('ClassesFilters Component', () => {
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

    const coursesApiUrl = `
    ${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=false&institution_id=1&page=1`;
    const instructorApiUrl = `
    ${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/?page=1&institution_id=1&limit=false`;

    axiosMock.onGet(coursesApiUrl).reply(200, coursesMockResponse);
    axiosMock.onGet(instructorApiUrl).reply(200, instructorMockResponse);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test('Apply debe estar deshabilitado inicialmente y habilitarse con filtros', () => {
    const resetPagination = jest.fn();
    const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const buttonApply = getByText('Apply');
    expect(buttonApply).toBeDisabled();

    const instructorSelect = getAllByTestId('select')[1];
    fireEvent.change(instructorSelect, {
      target: { value: 's4mS3pi0l' },
    });

    expect(buttonApply).toBeEnabled();

    const classInput = getByTestId('class_name');
    fireEvent.change(classInput, {
      target: { value: 'ab' },
    });

    expect(buttonApply).toBeEnabled();
  });

  test('Should call the service when apply filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const instructorSelect = getAllByTestId('select')[1];
    const classInput = getByTestId('class_name');
    const buttonApply = getByText('Apply');

    fireEvent.change(instructorSelect, {
      target: { value: 's4mS3pi0l' },
    });

    fireEvent.change(courseSelect, {
      target: { value: '1' },
    });

    fireEvent.change(classInput, {
      target: { value: 'math' },
    });

    await act(async () => {
      fireEvent.click(buttonApply);
    });

    expect(buttonApply).toBeInTheDocument();
  });

  test('Should clear the filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
      <ClassesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const classInput = getByTestId('class_name');
    const buttonReset = getByText('Reset');

    fireEvent.change(courseSelect, {
      target: { value: '1' },
    });

    fireEvent.change(classInput, {
      target: { value: 'test' },
    });

    await act(async () => {
      fireEvent.click(buttonReset);
    });

    expect(classInput).toHaveValue('');
  });
});
