import React from 'react';
import { render } from '@testing-library/react';
import StudentsFilters from 'features/Students/StudentsFilters';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { initializeStore } from 'store';

let store;

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('StudentsFilters Component', () => {
  const fetchData = jest.fn();
  const resetPagination = jest.fn();
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    mockSetFilters.mockClear();
    store = initializeStore();
  });

  test('renders input fields with placeholders', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <StudentsFilters
          fetchData={fetchData}
          resetPagination={resetPagination}
          setFilters={mockSetFilters}
        />
      </Provider>,
    );

    expect(getByPlaceholderText('Enter Student Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter Student Email')).toBeInTheDocument();
    expect(getByText('Course')).toBeInTheDocument();
    expect(getByText('Class')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
    expect(getByText('Exam ready')).toBeInTheDocument();
  });
});
