import { columns } from 'features/Classes/ClassesTable/columns';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(7);

    const [
      masterCourseNameColumn,
      classNameColumn,
      startDateColumn,
      endDateColumn,
      numberOfStudentsColumn,
      maxStudentsColumn,
      instructorsColumn,
    ] = columns;

    expect(masterCourseNameColumn).toHaveProperty('Header', 'Course');
    expect(masterCourseNameColumn).toHaveProperty('accessor', 'masterCourseName');

    expect(classNameColumn).toHaveProperty('Header', 'Class');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(startDateColumn).toHaveProperty('Header', 'Start Date');
    expect(startDateColumn).toHaveProperty('accessor', 'startDate');

    expect(endDateColumn).toHaveProperty('Header', 'End Date');
    expect(endDateColumn).toHaveProperty('accessor', 'endDate');

    expect(numberOfStudentsColumn).toHaveProperty('Header', 'Students Enrolled');
    expect(numberOfStudentsColumn).toHaveProperty('accessor', 'numberOfStudents');

    expect(maxStudentsColumn).toHaveProperty('Header', 'Max');
    expect(maxStudentsColumn).toHaveProperty('accessor', 'maxStudents');

    expect(instructorsColumn).toHaveProperty('Header', 'Instructors');
    expect(instructorsColumn).toHaveProperty('accessor', 'instructors');
  });
});
