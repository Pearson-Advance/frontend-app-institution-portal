import { getColumns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  test('returns an array of columns with correct properties', () => {
    const columns = getColumns();

    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(10);

    const [
      nameColumn,
      emailColumn,
      courseNameColumn,
      ClassIdColumn,
      instructorsColumn,
      createdColumn,
      firstAccessColumn,
      lastAccessColumn,
      gradeColumn,
      ActionColumn,
    ] = columns;

    expect(nameColumn).toHaveProperty('Header', 'Name');
    expect(nameColumn).toHaveProperty('accessor', 'learner_name');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'learner_email');

    expect(courseNameColumn).toHaveProperty('Header', 'Class Name');
    expect(courseNameColumn).toHaveProperty('accessor', 'ccx_name');

    expect(ClassIdColumn).toHaveProperty('Header', 'Class Id');
    expect(ClassIdColumn).toHaveProperty('accessor', 'ccx_id');

    expect(instructorsColumn).toHaveProperty('Header', 'Instructors');
    expect(instructorsColumn).toHaveProperty('accessor', 'instructors');

    expect(createdColumn).toHaveProperty('Header', 'Created');
    expect(createdColumn).toHaveProperty('accessor', 'created');

    expect(firstAccessColumn).toHaveProperty('Header', 'First Access');
    expect(firstAccessColumn).toHaveProperty('accessor', 'first_access');

    expect(lastAccessColumn).toHaveProperty('Header', 'Last Access');
    expect(lastAccessColumn).toHaveProperty('accessor', 'last_access');

    expect(gradeColumn).toHaveProperty('Header', 'Grade');
    expect(gradeColumn).toHaveProperty('accessor', 'grade');

    expect(ActionColumn).toHaveProperty('Header', 'Action');
    expect(ActionColumn).toHaveProperty('accessor', 'status');
  });
});
