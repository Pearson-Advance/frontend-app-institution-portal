import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { initializeStore } from 'store';

let store;

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('InstructorsFilters Component', () => {
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    store = initializeStore();
    mockSetFilters.mockClear();
  });

  test('call service when apply filters', async () => {
    const resetPagination = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <InstructorsFilters
          resetPagination={resetPagination}
        />
      </Provider>,
    );

    const nameInput = getByPlaceholderText('Enter Instructor Name');
    const emailInput = getByPlaceholderText('Enter Instructor Email');
    const buttonApplyFilters = getByText('Apply');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Name' } });
    fireEvent.change(emailInput, { target: { value: 'name@example.com' } });

    expect(nameInput).toHaveValue('Name');
    expect(emailInput).toHaveValue('name@example.com');

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('clear filters', async () => {
    const resetPagination = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <InstructorsFilters
          resetPagination={resetPagination}
        />
      </Provider>,
    );

    const nameInput = getByPlaceholderText('Enter Instructor Name');
    const emailInput = getByPlaceholderText('Enter Instructor Email');
    const buttonClearFilters = getByText('Reset');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Name' } });
    fireEvent.change(emailInput, { target: { value: 'name@example.com' } });

    expect(nameInput).toHaveValue('Name');
    expect(emailInput).toHaveValue('name@example.com');

    await act(async () => {
      fireEvent.click(buttonClearFilters);
    });

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
  });
});
