/* eslint-disable react/prop-types */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import CoursesFilters from 'features/Courses/CoursesFilters';
import '@testing-library/jest-dom/extend-expect';

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

describe('InstructorsFilters Component', () => {
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  const dataCourses = [
    {
      masterCourseName: 'Demo Course 1',
      numberOfClasses: 1,
      missingClassesForInstructor: null,
      numberOfStudents: 1,
      numberOfPendingStudents: 1,
    },
    {
      masterCourseName: 'Demo Course 2',
      numberOfClasses: 1,
      missingClassesForInstructor: 1,
      numberOfStudents: 16,
      numberOfPendingStudents: 0,
    },
  ];

  test('call service when apply filters', async () => {
    const fetchData = jest.fn();
    const resetPagination = jest.fn();
    const { getByText, getByTestId } = render(
      <CoursesFilters
        fetchData={fetchData}
        resetPagination={resetPagination}
        setFilters={mockSetFilters}
        dataCourses={dataCourses}
      />,
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
    expect(fetchData).toHaveBeenCalledTimes(1);
  });

  test('clear filters', async () => {
    const fetchData = jest.fn();
    const resetPagination = jest.fn();
    const { getByText, getByTestId } = render(
      <CoursesFilters
        fetchData={fetchData}
        resetPagination={resetPagination}
        setFilters={mockSetFilters}
        dataCourses={dataCourses}
      />,
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
    expect(resetPagination).toHaveBeenCalledTimes(1);
  });
});
