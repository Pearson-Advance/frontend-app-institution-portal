import { columns } from 'features/Courses/CoursesTable/columns';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(5);

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
});
