import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { StudentsFilters } from 'features/Students/StudentsFilters';
import '@testing-library/jest-dom/extend-expect';

const mockSetFilters = jest.fn();

const initialFilters = {
  learner_name: '',
  learner_email: '',
  instructor: '',
  ccx_name: '',
};

describe('StudentsFilters Component', () => {
  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  test('renders input fields with placeholders', () => {
    const { getByPlaceholderText } = render(<StudentsFilters filters={initialFilters} setFilters={mockSetFilters} />);

    expect(getByPlaceholderText('Enter Student Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter Student Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter Instructor')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter Class Name')).toBeInTheDocument();
  });

  test('updates filters when input fields change', () => {
    const { getByPlaceholderText } = render(<StudentsFilters filters={initialFilters} setFilters={mockSetFilters} />);

    const nameInput = getByPlaceholderText('Enter Student Name');
    const emailInput = getByPlaceholderText('Enter Student Email');
    const instructorInput = getByPlaceholderText('Enter Instructor');
    const classNameInput = getByPlaceholderText('Enter Class Name');

    fireEvent.change(nameInput, { target: { value: 'Name' } });
    fireEvent.change(emailInput, { target: { value: 'name@example.com' } });
    fireEvent.change(instructorInput, { target: { value: 'Instructor 1' } });
    fireEvent.change(classNameInput, { target: { value: 'CCX01' } });

    expect(mockSetFilters).toHaveBeenCalledTimes(4);
    expect(mockSetFilters).toHaveBeenCalledWith({
      ...initialFilters,
      learner_name: 'Name',
    });
    expect(mockSetFilters).toHaveBeenCalledWith({
      ...initialFilters,
      learner_email: 'name@example.com',
    });
    expect(mockSetFilters).toHaveBeenCalledWith({
      ...initialFilters,
      instructor: 'Instructor 1',
    });
    expect(mockSetFilters).toHaveBeenCalledWith({
      ...initialFilters,
      ccx_name: 'CCX01',
    });
  });
});
