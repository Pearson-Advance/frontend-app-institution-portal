import { MemoryRouter, Route } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { columns } from 'features/Classes/ClassesTable/columns';

import { renderWithProviders } from 'test-utils';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(9);

    const [
      classNameColumn,
      instructor,
      enrollmentStatus,
      minStudentsAllowed,
      studentsEnrolled,
      maxStudents,
      startDate,
      endDate,
    ] = columns;

    expect(classNameColumn).toHaveProperty('Header', 'Class');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(instructor).toHaveProperty('Header', 'Instructor');
    expect(instructor).toHaveProperty('accessor', 'instructors');

    expect(minStudentsAllowed).toHaveProperty('Header', 'Min');
    expect(minStudentsAllowed).toHaveProperty('accessor', 'minStudentsAllowed');

    expect(enrollmentStatus).toHaveProperty('Header', 'Enrollment status');
    expect(enrollmentStatus).toHaveProperty('accessor', 'numberOfPendingStudents');

    expect(studentsEnrolled).toHaveProperty('Header', 'Students Enrolled');
    expect(studentsEnrolled).toHaveProperty('accessor', 'numberOfStudents');

    expect(maxStudents).toHaveProperty('Header', 'Max');
    expect(maxStudents).toHaveProperty('accessor', 'maxStudents');

    expect(startDate).toHaveProperty('Header', 'Start Date');
    expect(startDate).toHaveProperty('accessor', 'startDate');

    expect(endDate).toHaveProperty('Header', 'End Date');
    expect(endDate).toHaveProperty('accessor', 'endDate');
  });

  test('Show menu dropdown', async () => {
    const classDataMock = {
      masterCourseName: 'course example',
      masterCourseId: 'demo course',
      classId: 'class 01',
      className: 'class example',
      startDate: '',
      endDate: '',
      minStudents: 10,
      maxStudents: 100,
    };
    const ActionColumn = () => columns[8].Cell({
      row: {
        values: {
          masterCourseName: 'course example',
        },
        original: { ...classDataMock },
      },
    });

    const mockStore = {
      classes: {
        table: {
          data: [
            { ...classDataMock },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const {
      getByText, getByTestId, getAllByRole,
    } = renderWithProviders(
      <MemoryRouter initialEntries={['/classes/']}>
        <Route path="/classes/">
          <ActionColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const button = getByTestId('droprown-action');
    fireEvent.click(button);
    const editButton = getAllByRole('button')[2];
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(getByText('View class content')).toBeInTheDocument();
    expect(getByText('Manage Instructors')).toBeInTheDocument();
    expect(getByText('Edit Class')).toBeInTheDocument();
    expect(getByText('Gradebook')).toBeInTheDocument();
    expect(getByText('Delete Class')).toBeInTheDocument();
  });
});
