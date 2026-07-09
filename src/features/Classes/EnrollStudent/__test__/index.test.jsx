/* eslint-disable react/prop-types, react/function-component-definition */
import React from 'react';
import { renderWithProviders } from 'test-utils';
import { fireEvent, waitFor } from '@testing-library/react';

import EnrollStudent from 'features/Classes/EnrollStudent';
import { useGetClassesByCourseQuery } from 'features/Classes/data/classesApi';

import * as api from 'features/Students/data/api';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ courseId: 'Demo course', classId: 'ccx-v1' })),
}));

jest.mock('features/Students/data/api', () => ({
  handleEnrollments: jest.fn().mockReturnValue({}),
  getMessages: jest.fn().mockReturnValue({}),
}));

jest.mock('features/Classes/data/classesApi', () => ({
  ...jest.requireActual('features/Classes/data/classesApi'),
  useGetClassesByCourseQuery: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('react-paragon-topaz', () => ({
  Button: ({ children, type = 'button', ...props }) => (
    <button type={type === 'submit' ? 'submit' : 'button'} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@openedx/paragon', () => {
  const Form = ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>;
  Form.Control = ({ as, ...props }) => {
    const controlProps = { ...props };
    delete controlProps.autoResize;

    if (as === 'textarea') {
      return <textarea {...controlProps} />;
    }

    return <input {...controlProps} />;
  };

  const ModalDialog = ({ children, isOpen }) => (isOpen ? <div>{children}</div> : null);
  ModalDialog.Header = ({ children }) => <div>{children}</div>;
  ModalDialog.Title = ({ children }) => <h2>{children}</h2>;
  ModalDialog.Body = ({ children, className }) => <div className={className}>{children}</div>;

  return {
    Form,
    Toast: ({ show, children, ...props }) => (show ? <div {...props}>{children}</div> : null),
    Spinner: () => <div>loading</div>,
    FormGroup: ({ children }) => <div>{children}</div>,
    ModalDialog,
    ModalCloseButton: ({ children, ...props }) => <button type="button" {...props}>{children}</button>,
  };
});

const mockStore = {
  main: {
    selectedInstitution: {
      id: 1,
    },
  },
  classes: {
    allClasses: {
      data: [
        {
          classId: 'ccx-v1',
          className: 'demo class',
        },
      ],
    },
  },
};

describe('EnrollStudent', () => {
  beforeEach(() => {
    useGetClassesByCourseQuery.mockReturnValue({
      data: mockStore.classes.allClasses.data,
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render with correct elements', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <EnrollStudent isOpen onClose={() => {}} />,
      { preloadedState: mockStore },
    );

    expect(getByText('Invite student to enroll')).toBeInTheDocument();
    expect(getByText('Class: demo class')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter email of the student to enroll')).toBeInTheDocument();
    expect(getByText('Send invite')).toBeInTheDocument();
  });

  test('Should handle form submission and shows success toast', async () => {
    const onCloseMock = jest.fn();

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} />,
      { preloadedState: mockStore },
    );

    const handleEnrollmentsMock = jest.spyOn(api, 'handleEnrollments').mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
        }],
      },
    });
    jest.spyOn(api, 'getMessages').mockResolvedValue({ data: { results: [] } });

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message')).toHaveTextContent('Successfully enrolled and sent email to the following user:');
      expect(getByTestId('toast-message')).toHaveTextContent('test@example.com');
    });

    expect(handleEnrollmentsMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    handleEnrollmentsMock.mockRestore();
  });

  test('Should handle form submission and show error toast', async () => {
    const onCloseMock = jest.fn();

    jest.spyOn(api, 'handleEnrollments').mockResolvedValue({ data: { results: [] } });

    const messagesApiMock = jest.spyOn(api, 'getMessages').mockResolvedValue({
      data: {
        results: [{ tags: 'error', message: 'Enrollment limit reached' }],
      },
    });

    const { getByPlaceholderText, getByText } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} />,
      { preloadedState: mockStore },
    );

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Enrollment limit reached')).toBeInTheDocument();
    });

    expect(messagesApiMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    messagesApiMock.mockRestore();
  });

  test('Should handle form submission and show error toast for invalid email', async () => {
    const onCloseMock = jest.fn();

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} />,
      { preloadedState: mockStore },
    );

    const handleEnrollmentsMock = jest.spyOn(api, 'handleEnrollments').mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
          invalidIdentifier: true,
        }],
      },
    });
    jest.spyOn(api, 'getMessages').mockResolvedValue({ data: { results: [] } });

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message')).toHaveTextContent('The following email adress is invalid:');
      expect(getByTestId('toast-message')).toHaveTextContent('test@example.com');
    });

    expect(handleEnrollmentsMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    handleEnrollmentsMock.mockRestore();
  });
});
