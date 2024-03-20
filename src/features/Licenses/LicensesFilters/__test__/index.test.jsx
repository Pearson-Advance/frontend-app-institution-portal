/* eslint-disable react/prop-types */
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, act } from '@testing-library/react';

import { initializeMockApp } from '@edx/frontend-platform/testing';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { renderWithProviders } from 'test-utils';

import LicensesFilters from 'features/Licenses/LicensesFilters';

let axiosMock;

const courseOption = {
  masterCourseName: 'Demo Course 1',
  numberOfClasses: 1,
  missingClassesForInstructor: null,
  numberOfStudents: 1,
  numberOfPendingStudents: 1,
};

const licenseOption = {
  licenseName: 'example',
  purchased_seats: 20,
  number_of_students: 3,
  number_of_pending_students: 0,
};

const coursesMockResponse = {
  results: [courseOption],
  count: 1,
  num_pages: 1,
  current_page: 1,
};

const licensesMockResponse = {
  results: [licenseOption],
  count: 1,
  num_pages: 1,
  current_page: 1,
};

const mockStore = {
  courses: {
    table: {
      currentPage: 1,
      data: [
        courseOption,
      ],
    },
    filters: {},
  },
  licenses: {
    table: {
      currentPage: 1,
      data: [
        licenseOption,
      ],
    },
    filters: {},
  },
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
};

jest.mock('react-select', () => function reactSelect({ options, currentValue, onChange }) {
  function handleChange(event) {
    const currentOption = options.find(
      (option) => option.value === event.currentTarget.value,
    );
    onChange(currentOption);
  }

  return (
    <select data-testid="select" value={currentValue} onChange={handleChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

describe('LicensesFilters Component', () => {
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 1,
        username: 'edx',
        administrator: true,
        roles: [],
      },
    });

    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    mockSetFilters.mockClear();

    const coursesApiUrl = `
    ${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/courses/?limit=true&institution_id=1`;
    const licensesApiUrl = `
    ${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool/?limit=true&institution_id=1&page=1&`;
    const licensesApiUrlWithParams = `
    ${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/license-pool/?limit=true&institution_id=1&page=1&license_name=&course_name=Demo%20Course%201`;

    axiosMock.onGet(coursesApiUrl)
      .reply(200, coursesMockResponse);

    axiosMock.onGet(licensesApiUrl)
      .reply(200, licensesMockResponse);

    axiosMock.onGet(licensesApiUrlWithParams)
      .reply(200, licensesMockResponse);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test(
    'The <Apply> button should be disabled if there is no selection in any filter, then it will be available if the user selects an option',
    () => {
      const resetPagination = jest.fn();
      const { getByText, getAllByTestId } = renderWithProviders(
        <LicensesFilters resetPagination={resetPagination} />,
        { preloadedState: mockStore },
      );

      const buttonApplyFilters = getByText('Apply');
      expect(buttonApplyFilters).toHaveAttribute('disabled');

      const licenseSelect = getAllByTestId('select')[0];

      fireEvent.change(licenseSelect, {
        target: { value: 'example' },
      });

      expect(buttonApplyFilters).not.toHaveAttribute('disabled');
    },
  );

  test('Should call the service when apply filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getAllByTestId } = renderWithProviders(
      <LicensesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const licenseSelect = getAllByTestId('select')[0];
    const courseSelect = getAllByTestId('select')[1];
    const buttonApplyFilters = getByText('Apply');

    expect(licenseSelect).toBeInTheDocument();
    expect(courseSelect).toBeInTheDocument();

    fireEvent.change(licenseSelect, {
      target: { value: 'example' },
    });

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    expect(getByText('example')).toBeInTheDocument();
    expect(getByText('Demo Course 1')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('Should clear the filters', async () => {
    const resetPagination = jest.fn();
    const { getByText, getAllByTestId } = renderWithProviders(
      <LicensesFilters resetPagination={resetPagination} />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[1];
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
