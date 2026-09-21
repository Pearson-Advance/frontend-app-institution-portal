/* eslint-disable react/prop-types, no-shadow, global-require */
import { fireEvent, waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import Actions from 'features/Classes/Class/ClassPage/Actions';
import { useGetClassesByCourseQuery } from 'features/Classes/data/classesApi';
import * as coursesThunks from 'features/Courses/data/thunks';

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => ({
    LEARNING_MICROFRONTEND_URL: '',
    GRADEBOOK_MICROFRONTEND_URL: '',
    LMS_BASE_URL: '',
  }),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('features/Classes/data/classesApi', () => ({
  ...jest.requireActual('features/Classes/data/classesApi'),
  useGetClassesByCourseQuery: jest.fn(),
}));

jest.mock('features/Courses/data/thunks', () => ({
  ...jest.requireActual('features/Courses/data/thunks'),
  toggleClassVisibility: jest.fn(() => () => Promise.resolve({ success: true, message: 'Class hidden successfully' })),
}));

jest.mock('react-paragon-topaz', () => ({
  Button: ({ children, ...props }) => <button type="button" {...props}>{children}</button>,
}));

jest.mock('features/Courses/AddClass', () => function MockAddClass() {
  return <div data-testid="add-class" />;
});

jest.mock('features/Common/DeleteModal', () => function MockDeleteModal() {
  return <div data-testid="delete-modal" />;
});

jest.mock('features/Classes/EnrollStudent', () => function MockEnrollStudent() {
  return <div data-testid="enroll-student" />;
});

jest.mock('@openedx/paragon', () => {
  const React = require('react');

  const Dropdown = ({ children }) => <div>{children}</div>;
  Dropdown.Toggle = function DropdownToggle({ children, ...props }) {
    return <button type="button" {...props}>{children}</button>;
  };
  Dropdown.Menu = function DropdownMenu({ children }) {
    return <div>{children}</div>;
  };
  Dropdown.Item = function DropdownItem({ children, ...props }) {
    return <button type="button" {...props}>{children}</button>;
  };

  return {
    Dropdown,
    IconButton: (props) => <button type="button" {...props} />,
    Icon: () => <span />,
    Toast: ({ show, children }) => (show ? <div>{children}</div> : null),
    useToggle: (initial = false) => {
      const [value, setValue] = React.useState(initial);
      return [value, () => setValue(true), () => setValue(false)];
    },
  };
});

const courseId = 'course-v1:demo+demo1+2020';
const classId = 'ccx-v1:demo+demo1+2020+ccx@1';
const routePath = '/courses/:courseId/:classId';
const routeUrl = `/courses/${encodeURIComponent(courseId)}/${encodeURIComponent(classId)}`;

const preloadedState = {
  main: { selectedInstitution: { id: 1 } },
  courses: { newClass: { status: 'idle' } },
};

const renderActions = () => renderWithProviders(
  <Route path={routePath} element={<Actions previousPage="classes" />} />,
  { preloadedState, initialEntries: [routeUrl] },
);

describe('Class Details Actions - Hide/Show', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows Hide class for a visible class and dispatches the toggle', async () => {
    useGetClassesByCourseQuery.mockReturnValue({
      data: [{ classId, className: 'Test class', hidden: false }],
    });

    const { getByText, getByTestId } = renderActions();

    expect(getByText('Hide class')).toBeInTheDocument();

    fireEvent.click(getByTestId('toggle-visibility-action'));

    await waitFor(() => {
      expect(coursesThunks.toggleClassVisibility).toHaveBeenCalledWith(classId, true);
    });
  });

  test('shows Show class for a hidden class and dispatches the toggle', async () => {
    useGetClassesByCourseQuery.mockReturnValue({
      data: [{ classId, className: 'Test class', hidden: true }],
    });

    const { getByText, getByTestId } = renderActions();

    expect(getByText('Show class')).toBeInTheDocument();

    fireEvent.click(getByTestId('toggle-visibility-action'));

    await waitFor(() => {
      expect(coursesThunks.toggleClassVisibility).toHaveBeenCalledWith(classId, false);
    });
  });
});
