import React from 'react';
import { fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';

import InstructorsFilters from 'features/Instructors/InstructorsFilters';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    SHOW_INSTRUCTOR_FEATURES: true,
  })),
}));

describe('InstructorsFilters Component', () => {
  const resetPagination = jest.fn();

  const setup = (props = {}) => renderWithProviders(
    <InstructorsFilters resetPagination={resetPagination} {...props} />,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should render the name input and applies filters', async () => {
    const { getByTestId, getByText } = setup();

    const nameInput = getByTestId('instructorName');
    const applyButton = getByText('Apply');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput).toHaveValue('Jane Doe');

    await act(async () => {
      fireEvent.click(applyButton);
    });
  });

  test('Should switch to email input and applies filters', async () => {
    const { getByTestId, getByText } = setup();

    fireEvent.click(getByTestId('emailCheckbox'));

    const emailInput = getByTestId('instructorEmail');
    expect(emailInput).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.click(getByText('Apply'));
    });
  });

  test('Should reset the fields and filters', async () => {
    const { getByTestId, getByText } = setup();

    const nameInput = getByTestId('instructorName');
    fireEvent.change(nameInput, { target: { value: 'Reset Me' } });
    expect(nameInput).toHaveValue('Reset Me');

    const resetButton = getByText('Reset');

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(nameInput).toHaveValue('');
  });

  test('renders course select when not in assign mode', () => {
    const { getByText, getByRole } = setup();

    expect(getByText('Course')).toBeInTheDocument();
    expect(getByRole('combobox')).toBeInTheDocument();
  });

  describe('Assign mode', () => {
    test('hides course select and switch', () => {
      const { queryByText, queryByRole } = setup({ isAssignSection: true });

      expect(queryByText('Course')).not.toBeInTheDocument();
      expect(queryByRole('checkbox')).not.toBeInTheDocument();
    });

    test('disables apply and reset buttons when fields are empty', () => {
      const { getByText } = setup({ isAssignSection: true });

      expect(getByText('Apply')).toBeDisabled();
      expect(getByText('Reset')).toBeDisabled();
    });

    test('enables apply button when email is filled', () => {
      const { getByTestId, getByText } = setup({ isAssignSection: true });

      fireEvent.click(getByTestId('emailCheckbox'));

      const emailInput = getByTestId('instructorEmail');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(getByText('Apply')).not.toBeDisabled();
    });
  });
});
