/* eslint-disable react/prop-types */
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, act } from '@testing-library/react';
import CoursesFilters from 'features/Courses/CoursesFilters';
import '@testing-library/jest-dom/extend-expect';
import { initializeStore } from 'store';
import { fetchCoursesData } from 'features/Courses/data/thunks';
import { executeThunk } from 'test-utils';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

let axiosMock;
let store;

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

const mockResponse = {
  results: [
    {
      masterCourseName: 'Demo Course 1',
      numberOfClasses: 1,
      missingClassesForInstructor: null,
      numberOfStudents: 1,
      numberOfPendingStudents: 1,
    },
  ],
  count: 2,
  num_pages: 1,
  current_page: 1,
};

describe('CoursesFilters Component', () => {
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 1,
        username: 'testuser',
        administrator: true,
        roles: [],
      },
    });
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    mockSetFilters.mockClear();
    store = initializeStore();

    const coursesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=true&institution_id=1`;
    axiosMock.onGet(coursesApiUrl)
      .reply(200, mockResponse);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test('call service when apply filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <CoursesFilters resetPagination={resetPagination} />
      </Provider>,
    );

    await executeThunk(fetchCoursesData(1), store.dispatch, store.getState);

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
  });

  test('clear filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <CoursesFilters resetPagination={resetPagination} />
      </Provider>,
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
  });
});
