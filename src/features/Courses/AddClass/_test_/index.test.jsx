import { waitFor, fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';
import AddClass from 'features/Courses/AddClass';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  instructors: {
    selectOptions: {
      data: [
        {
          masterCourseName: 'Demo Course 1',
          numberOfClasses: 1,
          missingClassesForInstructor: null,
          numberOfStudents: 1,
          numberOfPendingStudents: 11,
        },
      ],
    },
  },
};

const courseInfoMocked = {
  masterCourseId: 'course-v1:XXX+YYY+2023',
  masterCourseName: 'Demo Course 1',
};

const basePath = `/courses/${encodeURIComponent(
  'course-v1:XXX+YYY+2023',
)}`;

describe('Add class modal', () => {
  const renderComponent = () => renderWithProviders(
    <Route
      path="/courses/:courseId"
      element={(
        <AddClass
          isOpen
          onClose={() => {}}
          courseInfo={courseInfoMocked}
        />
        )}
    />,
    {
      preloadedState: mockStore,
      initialEntries: [basePath],
    },
  );

  test('render add class modal', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    waitFor(() => {
      const cancelButton = getByText('Cancel');
      const submitButton = getByText('Submit');
      const classNameField = getByPlaceholderText('Class name / Title *');
      const startDateField = getByPlaceholderText('Start date *');
      expect(getByText('Add class')).toBeInTheDocument();
      expect(getByText('Demo Course 1')).toBeInTheDocument();
      expect(classNameField).toBeInTheDocument();
      expect(startDateField).toBeInTheDocument();
      expect(getByPlaceholderText('End date')).toBeInTheDocument();
      expect(getByPlaceholderText('Minimum enrollment')).toBeInTheDocument();
      expect(getByPlaceholderText('Maximum enrollment')).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(classNameField, {
        target: { value: 'new class' },
      });
      fireEvent.change(startDateField, { target: { value: '2023-12-10' } });

      fireEvent.click(submitButton);
    });
  });

  test('cancel button in add classmodal', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    waitFor(() => {
      const cancelButton = getByText('Cancel');
      const submitButton = getByText('Submit');
      const classNameField = getByPlaceholderText('Class name / Title *');
      expect(cancelButton).toBeInTheDocument();

      fireEvent.change(classNameField, {
        target: { value: 'new class' },
      });

      fireEvent.click(submitButton);
      expect(classNameField).toHaveValue('');
    });
  });
});
