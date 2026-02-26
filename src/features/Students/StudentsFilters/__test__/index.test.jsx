/* eslint-disable react/prop-types, react/button-has-type */
import { fireEvent, act, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import StudentsFilters from 'features/Students/StudentsFilters';
import { fetchStudentsData } from 'features/Students/data/thunks';

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

jest.mock('react-paragon-topaz', () => ({
  Select: ({
    options = [], value, onChange, name,
  }) => (
    <select
      data-testid={name || 'select'}
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
    <button type={type} {...props}>
      {children}
    </button>
  ),
}));

describe('StudentsFilters Component', () => {
  const resetPagination = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders inputs and select elements correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    expect(getByText('Search')).toBeInTheDocument();
    expect(getByTestId('course_id')).toBeInTheDocument();
    expect(getByTestId('class_name')).toBeInTheDocument();
    expect(getByTestId('exam_ready')).toBeInTheDocument();
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
    const { getByText, getByTestId } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const examSelect = getByTestId('exam_ready');
    fireEvent.change(examSelect, {
      target: { value: 'IN_PROGRESS' },
    });

    const applyButton = getByText('Apply');

    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(fetchStudentsData).toHaveBeenCalled();
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
