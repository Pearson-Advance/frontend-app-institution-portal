import React from 'react';
import { fireEvent, act } from '@testing-library/react';
import StudentsFilters from 'features/Students/StudentsFilters';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('StudentsFilters Component', () => {
  const resetPagination = jest.fn();
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  test('render name input and call service when apply filters', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    expect(getByPlaceholderText('Enter Student Name')).toBeInTheDocument();
    expect(getByText('Course')).toBeInTheDocument();
    expect(getByText('Class')).toBeInTheDocument();
    expect(getByText('Exam ready')).toBeInTheDocument();

    const inputName = getByTestId('learnerName');
    const buttonApplyFilters = getByText('Apply');

    fireEvent.change(inputName, {
      target: { value: 'Jhon Doe' },
    });

    expect(inputName).toHaveValue('Jhon Doe');

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('render email input', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <StudentsFilters
        resetPagination={resetPagination}
      />,
    );

    const checkbox = getByTestId('emailCheckbox');
    const buttonApplyFilters = getByText('Apply');

    fireEvent.click(checkbox);

    expect(getByPlaceholderText('Enter Student Email')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('Clear filters', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <StudentsFilters
        resetPagination={resetPagination}
      />,
    );

    const nameInput = getByPlaceholderText('Enter Student Name');
    const buttonClearFilters = getByText('Reset');

    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Name' } });

    expect(nameInput).toHaveValue('Name');

    await act(async () => {
      fireEvent.click(buttonClearFilters);
    });

    expect(nameInput).toHaveValue('');
  });
});
