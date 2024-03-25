/* eslint-disable react/prop-types */
import React from 'react';
import { fireEvent, act } from '@testing-library/react';
import CoursesFilters from 'features/Courses/CoursesFilters';
import '@testing-library/jest-dom/extend-expect';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { renderWithProviders } from 'test-utils';

jest.mock('react-select', () => function reactSelect({ options, valueR, onChange }) {
  function handleChange(event) {
    const option = options.find(
      (optionR) => optionR.value === event.currentTarget.value,
    );
    onChange(option);
  }

  return (
    <select data-testid="select" value={valueR} onChange={handleChange}>
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

  test('call service when apply filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getByTestId } = renderWithProviders(
      <CoursesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const courseSelect = getByTestId('select');
    const buttonApplyFilters = getByText('Apply');

    expect(courseSelect).toBeInTheDocument();
    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    expect(getByText('Demo Course 1')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('clear filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getByTestId } = renderWithProviders(
      <CoursesFilters resetPagination={resetPagination} />,
    );

    const courseSelect = getByTestId('select');
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
