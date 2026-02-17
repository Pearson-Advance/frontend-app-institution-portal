import React from 'react';
import { renderWithProviders } from 'test-utils';
import { fireEvent, act, waitFor } from '@testing-library/react';

import StudentsFilters from 'features/Students/StudentsFilters';
import { fetchStudentsData } from 'features/Students/data/thunks';
import { updateFilters } from 'features/Students/data/slice';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Students/data/thunks', () => ({
  fetchStudentsData: jest.fn(() => ({ type: 'FETCH_STUDENTS' })),
}));

jest.mock('features/Courses/data/thunks', () => ({
  fetchCoursesOptionsData: jest.fn(() => ({ type: 'FETCH_COURSES' })),
}));

jest.mock('features/Classes/data/thunks', () => ({
  fetchClassesOptionsData: jest.fn(() => ({ type: 'FETCH_CLASSES' })),
}));

jest.mock('features/Students/data/slice', () => ({
  updateFilters: jest.fn(() => ({ type: 'UPDATE_FILTERS' })),
  updateCurrentPage: jest.fn(() => ({ type: 'UPDATE_PAGE' })),
}));

describe('StudentsFilters Component', () => {
  const resetPagination = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders inputs and select elements correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    expect(getByText('Search')).toBeInTheDocument();
    expect(getByText('Course')).toBeInTheDocument();
    expect(getByText('Class')).toBeInTheDocument();
    expect(getByText('Exam ready')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter Student Name')).toBeInTheDocument();
  });

  test('switches to email input when selecting email radio option', async () => {
    const {
      getByTestId, getByPlaceholderText, getByText, queryByPlaceholderText,
    } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const checkbox = getByTestId('emailCheckbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(getByPlaceholderText('Enter Student Email')).toBeInTheDocument();
      expect(queryByPlaceholderText('Enter Student Name')).not.toBeInTheDocument();
    });

    const buttonApply = getByText('Apply');
    await act(async () => {
      fireEvent.click(buttonApply);
    });
  });

  test('filters students by name and applies filters', async () => {
    const { getByTestId, getByText } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const nameInput = getByTestId('learnerName');
    const applyButton = getByText('Apply');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput).toHaveValue('Jane Doe');

    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(fetchStudentsData).toHaveBeenCalled();
  });

  test('allows selecting "Exam ready" option and applying filters', async () => {
    const { getByText, getAllByText } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const examSelect = getByText('Exam ready');
    fireEvent.mouseDown(examSelect);

    const option = getAllByText('In Progress')[0];
    fireEvent.click(option);

    const applyButton = getByText('Apply');

    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(fetchStudentsData).toHaveBeenCalled();
  });

  test('renders all options for "Exam ready" select', async () => {
    const { getByText, getAllByText } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const examSelect = getByText('Exam ready');
    fireEvent.mouseDown(examSelect);

    const expectedOptions = [
      'In Progress',
      'Restarted',
      'EPP Eligible',
      'Unavailable',
      'Not Started',
    ];

    expectedOptions.forEach((option) => {
      expect(getAllByText(option)[0]).toBeInTheDocument();
    });
  });

  test('sends correct filter value when selecting "Exam ready" option', async () => {
    const { getByText, getAllByText } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const examSelect = getByText('Exam ready');
    fireEvent.mouseDown(examSelect);

    const selectedOption = getAllByText('EPP Eligible')[0];
    fireEvent.click(selectedOption);

    const applyButton = getByText('Apply');

    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(updateFilters).toHaveBeenCalledWith(expect.objectContaining({
      exam_ready: 'EPP_ELIGIBLE',
    }));
  });

  test('clears filters when clicking Reset', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const nameInput = getByPlaceholderText('Enter Student Name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    expect(nameInput).toHaveValue('Test User');

    const resetButton = getByText('Reset');
    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(nameInput).toHaveValue('');
    expect(fetchStudentsData).toHaveBeenCalled();
    expect(resetPagination).toHaveBeenCalled();
  });
});
