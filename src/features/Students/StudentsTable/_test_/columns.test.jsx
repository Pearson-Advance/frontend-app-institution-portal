import { getColumns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  test('returns an array of columns with correct properties', () => {
    const columns = getColumns();

    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(7);

    const [
      nameColumn,
      emailColumn,
      courseNameColumn,
      ClassIdColumn,
      instructorsColumn,
      createdColumn,
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

    expect(ActionColumn).toHaveProperty('Header', 'Action');
    expect(ActionColumn).toHaveProperty('accessor', 'status');
  });
});
