/* eslint-disable react/prop-types */
import React from 'react';
import { fireEvent } from '@testing-library/react';
import CoursesFilters from 'features/Courses/CoursesFilters';
import '@testing-library/jest-dom/extend-expect';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { renderWithProviders } from 'test-utils';
import { allResultsOption } from 'features/constants';

jest.mock('react-select', () => function reactSelect({ options, valueR, onChange }) {
  function handleChange(event) {
    onChange({ id: event.currentTarget.value });

    return event;
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

  test('should select a course', async () => {
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
});
