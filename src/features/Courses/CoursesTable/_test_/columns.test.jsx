import { Route } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';
import { columns } from 'features/Courses/CoursesTable/columns';
import { renderWithProviders } from 'test-utils';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(6);

    const [
      courseColumn,
      classesColumn,
      instructorColumn,
      enrollmentColumn,
      studentsInvitedColumn,
    ] = columns;

    expect(courseColumn).toHaveProperty('Header', 'Courses');
    expect(courseColumn).toHaveProperty('accessor', 'masterCourseName');

    expect(classesColumn).toHaveProperty('Header', 'Classes');
    expect(classesColumn).toHaveProperty('accessor', 'numberOfClasses');

    expect(instructorColumn).toHaveProperty('Header', 'Instructor');
    expect(instructorColumn).toHaveProperty('accessor', 'missingClassesForInstructor');

    expect(enrollmentColumn).toHaveProperty('Header', 'Students Enrolled');
    expect(enrollmentColumn).toHaveProperty('accessor', 'numberOfStudents');

    expect(studentsInvitedColumn).toHaveProperty('Header', 'Students invited');
    expect(studentsInvitedColumn).toHaveProperty('accessor', 'numberOfPendingStudents');
  });

  test('Show menu dropdown', async () => {
    const ActionColumn = () => columns[5].Cell({
      row: {
        values: {
          masterCourseName: 'course example',
        },
        original: {
          masterCourseName: 'course example',
          masterCourseId: 'course01',
        },
      },
    });

    const mockStore = {
      courses: {
        table: {
          data: [
            {
              masterCourseName: 'Demo MasterCourse 1',
              masterCourseId: 'Demo Class 1',
            },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const component = renderWithProviders(
      <Route path="/courses" element={<ActionColumn />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/courses'],
      }
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);
    expect(component.getByText('Course content')).toBeInTheDocument();
    expect(component.getByText('Add Class')).toBeInTheDocument();
  });
});
