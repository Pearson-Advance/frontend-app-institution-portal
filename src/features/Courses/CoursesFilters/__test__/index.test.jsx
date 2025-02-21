/* eslint-disable react/prop-types */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { getConfig } from '@edx/frontend-platform';
import { fireEvent, waitFor } from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform/testing';

import { renderWithProviders } from 'test-utils';

import CoursesFilters from 'features/Courses/CoursesFilters';
import { allResultsOption } from 'features/constants';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
    enable_toggle_courses: true,
  })),
}));

jest.mock('react-select', () => function reactSelect({
  options, valueR, onChange, onInputChange,
}) {
  function handleInputChange(event) {
    onInputChange(event.currentTarget.value, { action: 'set-value' });

    return event;
  }

  function handleChange(event) {
    onChange({ id: event.currentTarget.value });
    handleInputChange(event);
    return event;
  }

  return (
    <select
      data-testid="select"
      value={valueR}
      onChange={handleChange}
    >
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

const mockStore = {
  courses: {
    table: {
      currentPage: 1,
      data: [
        {
          masterCourseName: 'Demo Course 1',
          numberOfClasses: 1,
          missingClassesForInstructor: null,
          numberOfStudents: 1,
          numberOfPendingStudents: 1,
        },
      ],
    },
    selectOptions: [
      {
        masterCourseName: 'Demo Course 1',
        numberOfClasses: 1,
        missingClassesForInstructor: null,
        numberOfStudents: 1,
        numberOfPendingStudents: 1,
      },
    ],
    filters: {},
  },
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
};

describe('CoursesFilters Component', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 1,
        username: 'testuser',
        administrator: true,
        roles: [],
      },
    });
  });

  test('Should select a course', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CoursesFilters />,
      { preloadedState: mockStore },
    );

    const courseSelect = getByTestId('select');

    expect(getByText('Find a primary course')).toBeInTheDocument();

    expect(courseSelect).toBeInTheDocument();
    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    expect(getByText('Demo Course 1')).toBeInTheDocument();
  });

  test('Should have option for all results ', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CoursesFilters />,
    );

    const courseSelect = getByTestId('select');

    expect(courseSelect).toBeInTheDocument();
    expect(courseSelect).toBeInTheDocument();
    fireEvent.change(courseSelect, {
      target: { value: allResultsOption.value },
    });

    expect(getByText('Show all search results')).toBeInTheDocument();
  });

  test('Should reset the toggle if a new value is selected from the selector', async () => {
    const { getByRole, getByTestId } = renderWithProviders(
      <CoursesFilters />,
      { preloadedState: mockStore },
    );

    const courseSelect = getByTestId('select');
    const toggle = getByRole('switch');

    expect(toggle).toBeInTheDocument();
    fireEvent.click(toggle);

    expect(toggle).toHaveProperty('checked', true);

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    await waitFor(() => {
      expect(toggle).toHaveProperty('checked', false);
    });
  });

  test('Should hide the toggle if the flag "enable_toggle_courses" is disabled', () => {
    getConfig.mockImplementation(() => ({
      enable_toggle_courses: false,
    }));

    const { queryByText } = renderWithProviders(
      <CoursesFilters />,
    );

    expect(queryByText('Show my courses')).not.toBeInTheDocument();
  });
});
