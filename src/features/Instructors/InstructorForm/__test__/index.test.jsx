import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import { RequestStatus } from 'features/constants';
import { updateInstructorFormRequest } from 'features/Instructors/data/slice';

import InstructorForm from 'features/Instructors/InstructorForm';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform/config', () => ({
  getConfig: jest.fn().mockReturnValue({
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v1',
  }),
}));

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockStore = {
  instructors: {
    table: {
    },
    classes: {
      data: [],
    },
    courses: {
      data: [],
    },
    filters: {
    },
    rowsSelected: [],
    classSelected: '',
    instructorForm: {
      status: RequestStatus.INITIAL,
      error: null,
      data: [],
    },
  },
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
};

describe('Instructor Form modal', () => {
  beforeEach(() => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((selector) => selector(mockStore));
  });

  test('Render add instructor modal', async () => {
    getConfig.mockImplementation(() => ({ SHOW_INSTRUCTOR_FEATURES: true }));

    const { getByText } = renderWithProviders(
      <InstructorForm isOpen onClose={() => { }} />,
      { preloadedState: mockStore },
    );

    expect(getByText('Add new instructor')).toBeInTheDocument();
    expect(getByText('Email *')).toBeInTheDocument();
    expect(getByText('First name')).toBeInTheDocument();
    expect(getByText('Last name')).toBeInTheDocument();
    expect(getByText('Has enrollment permission')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Add instructor')).toBeInTheDocument();
  });

  test('Should handle input changes correctly', () => {
    getConfig.mockImplementation(() => ({ SHOW_INSTRUCTOR_FEATURES: true }));

    const { getByPlaceholderText, getByLabelText } = renderWithProviders(
      <InstructorForm isOpen onClose={() => { }} />,
      { preloadedState: mockStore },
    );

    const emailInput = getByPlaceholderText('Enter Email of the instructor');
    const firstNameInput = getByPlaceholderText('Enter the first name of the instructor');
    const lastNameInput = getByPlaceholderText('Enter the last name of the instructor');
    const enrollmentSwitch = getByLabelText('Has enrollment permission');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.click(enrollmentSwitch);

    expect(emailInput.value).toBe('test@example.com');
    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(enrollmentSwitch.checked).toBe(true);
  });

  test('Should disable and enable the button submit depending if the email is filled', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <InstructorForm isOpen onClose={() => { }} />,
      { preloadedState: mockStore },
    );

    const sendButton = getByText('Add instructor');
    const emailInput = getByPlaceholderText('Enter Email of the instructor');

    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(sendButton).toBeEnabled();

    fireEvent.change(emailInput, { target: { value: '' } });
    expect(sendButton).toBeDisabled();
  });

  test('Edit mode', () => {
    const instructorMock = {
      instructorId: 1,
      hasEnrollmentPrivilege: true,
      instructorName: 'instructor test',
      instructorEmail: 'test@example.com',
    };

    const { getByText, getByLabelText } = renderWithProviders(
      <InstructorForm isOpen onClose={() => { }} isEditing instructorInfo={instructorMock} />,
      { preloadedState: mockStore },
    );

    expect(getByText('Edit instructor test')).toBeInTheDocument();
    const enrollmentSwitch = getByLabelText('Has enrollment permission');

    expect(enrollmentSwitch).toBeInTheDocument();
    expect(enrollmentSwitch.checked).toBe(true);
  });
});

describe('Instructor modal - Request', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should dispatch updateInstructorFormRequest actions on form submission', async () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((selector) => selector(mockStore));

    const { getByText, getByPlaceholderText } = renderWithProviders(
      <InstructorForm isOpen onClose={() => { }} />,
      { preloadedState: mockStore },
    );

    const emailInput = getByPlaceholderText('Enter Email of the instructor');
    const sendButton = getByText('Add instructor');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(sendButton);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'instructors/updateInstructorFormRequest',
      payload: { status: 'initial' },
    });

    await waitFor(() => (
      expect(dispatch).toHaveBeenCalledWith(updateInstructorFormRequest({ status: RequestStatus.INITIAL }))
    ));
  });
});
