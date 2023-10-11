import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import InstructorsFilters from 'features/Instructors/InstructorsFilters';
import '@testing-library/jest-dom/extend-expect';

describe('InstructorsFilters Component', () => {
  test('call service when apply filters', async () => {
    const fetchData = jest.fn();
    const resetPagination = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <InstructorsFilters fetchData={fetchData} resetPagination={resetPagination} />,
    );

    const button = getByText('Filters');
    await act(async () => {
      fireEvent.click(button);
    });

    const nameInput = getByPlaceholderText('Enter Instructor Name');
    const emailInput = getByPlaceholderText('Enter Instructor Email');
    const classNameInput = getByPlaceholderText('Enter Class Name');
    const buttonApplyFilters = getByText('Apply Filters');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(classNameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Name' } });
    fireEvent.change(emailInput, { target: { value: 'name@example.com' } });
    fireEvent.change(classNameInput, { target: { value: 'CCX01' } });

    expect(nameInput).toHaveValue('Name');
    expect(emailInput).toHaveValue('name@example.com');
    expect(classNameInput).toHaveValue('CCX01');

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });

    expect(fetchData).toHaveBeenCalledTimes(1);
  });

  test('clear filters', async () => {
    const fetchData = jest.fn();
    const resetPagination = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <InstructorsFilters fetchData={fetchData} resetPagination={resetPagination} />,
    );

    const button = getByText('Filters');
    await act(async () => {
      fireEvent.click(button);
    });

    const nameInput = getByPlaceholderText('Enter Instructor Name');
    const emailInput = getByPlaceholderText('Enter Instructor Email');
    const classNameInput = getByPlaceholderText('Enter Class Name');
    const buttonClearFilters = getByText('Clear');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(classNameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Name' } });
    fireEvent.change(emailInput, { target: { value: 'name@example.com' } });
    fireEvent.change(classNameInput, { target: { value: 'CCX01' } });

    expect(nameInput).toHaveValue('Name');
    expect(emailInput).toHaveValue('name@example.com');
    expect(classNameInput).toHaveValue('CCX01');

    await act(async () => {
      fireEvent.click(buttonClearFilters);
    });

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(classNameInput).toHaveValue('');
    expect(resetPagination).toHaveBeenCalledTimes(1);
  });
});
