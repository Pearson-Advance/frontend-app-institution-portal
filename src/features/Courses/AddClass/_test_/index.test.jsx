import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import AddClass from 'features/Courses/AddClass';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  instructors: {
    selectOptions: [
      {
        masterCourseName: 'Demo Course 1',
        numberOfClasses: 1,
        missingClassesForInstructor: null,
        numberOfStudents: 1,
        numberOfPendingStudents: 11,
      },
    ],
  },
};

const courseInfoMocked = {
  masterCourseId: 'course-v1:demo+demo1+2020',
  masterCourseName: 'Demo Course 1',
};

describe('Add class modal', () => {
  test('render add class modal', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201']}>
        <Route path="/courses/:classId">
          <AddClass isOpen onClose={() => { }} courseInfo={courseInfoMocked} />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

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
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201']}>
        <Route path="/courses/:classId">
          <AddClass isOpen onClose={() => { }} courseInfo={courseInfoMocked} />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

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
