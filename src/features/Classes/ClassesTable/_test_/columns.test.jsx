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
      masterCourseNameColumn,
      startDateColumn,
      endDateColumn,
      minStudentsAllowedColumn,
      numberOfStudentsColumn,
      maxStudentsColumn,
      instructorsColumn,
    ] = columns;

    expect(classNameColumn).toHaveProperty('Header', 'Class');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(masterCourseNameColumn).toHaveProperty('Header', 'Course');
    expect(masterCourseNameColumn).toHaveProperty('accessor', 'masterCourseName');

    expect(startDateColumn).toHaveProperty('Header', 'Start Date');
    expect(startDateColumn).toHaveProperty('accessor', 'startDate');

    expect(endDateColumn).toHaveProperty('Header', 'End Date');
    expect(endDateColumn).toHaveProperty('accessor', 'endDate');

    expect(minStudentsAllowedColumn).toHaveProperty('Header', 'Min');
    expect(minStudentsAllowedColumn).toHaveProperty('accessor', 'minStudentsAllowed');

    expect(numberOfStudentsColumn).toHaveProperty('Header', 'Students Enrolled');
    expect(numberOfStudentsColumn).toHaveProperty('accessor', 'numberOfStudents');

    expect(maxStudentsColumn).toHaveProperty('Header', 'Max');
    expect(maxStudentsColumn).toHaveProperty('accessor', 'maxStudents');

    expect(instructorsColumn).toHaveProperty('Header', 'Instructors');
    expect(instructorsColumn).toHaveProperty('accessor', 'instructors');
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
      getByText, getByTestId, getAllByRole, getAllByText,
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
    const editButton = getAllByRole('button')[1];
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(getAllByText('Edit Class')).toHaveLength(2);
    expect(getByText('course example')).toBeInTheDocument();
  });
});
