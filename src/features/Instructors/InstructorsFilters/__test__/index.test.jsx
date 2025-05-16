import React from 'react';
import { fireEvent, act } from '@testing-library/react';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('InstructorsFilters Component', () => {
  const resetPagination = jest.fn();
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  test('render name input and call service when apply filters', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <InstructorsFilters
        resetPagination={resetPagination}
      />,
    );

    expect(getByPlaceholderText('Enter Instructor Name')).toBeInTheDocument();
    expect(getByText('Course')).toBeInTheDocument();

    const inputName = getByTestId('instructorName');
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
      <InstructorsFilters
        resetPagination={resetPagination}
      />,
    );

    const checkbox = getByTestId('emailCheckbox');
    const buttonApplyFilters = getByText('Apply');

    fireEvent.click(checkbox);

    expect(getByPlaceholderText('Enter Instructor Email')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('Clear filters', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <InstructorsFilters
        resetPagination={resetPagination}
      />,
    );

    const nameInput = getByPlaceholderText('Enter Instructor Name');
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
