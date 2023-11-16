import { getColumns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  test('returns an array of columns with correct properties', () => {
    const columns = getColumns();

    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(8);

    const [
      nameColumn,
      courseNameColumn,
      courseIdColumn,
      classNameColumn,
      ClassIdColumn,
      instructorsColumn,
      statusColumn,
      examReadyColumn,
    ] = columns;

    expect(nameColumn).toHaveProperty('Header', 'Student');
    expect(nameColumn).toHaveProperty('accessor', 'learnerName');

    expect(courseNameColumn).toHaveProperty('Header', 'Course');
    expect(courseNameColumn).toHaveProperty('accessor', 'courseName');

    expect(courseIdColumn).toHaveProperty('Header', 'Course Id');
    expect(courseIdColumn).toHaveProperty('accessor', 'courseId');

    expect(classNameColumn).toHaveProperty('Header', 'Class Name');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(ClassIdColumn).toHaveProperty('Header', 'Class Id');
    expect(ClassIdColumn).toHaveProperty('accessor', 'classId');

    expect(instructorsColumn).toHaveProperty('Header', 'Instructor');
    expect(instructorsColumn).toHaveProperty('accessor', 'instructors');

    expect(statusColumn).toHaveProperty('Header', 'Status');
    expect(statusColumn).toHaveProperty('accessor', 'status');

    expect(examReadyColumn).toHaveProperty('Header', 'Exam Ready');
    expect(examReadyColumn).toHaveProperty('accessor', 'examReady');
  });
});
