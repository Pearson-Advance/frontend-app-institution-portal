import { getColumns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  test('returns an array of columns with correct properties', () => {
    const columns = getColumns();

    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(5);

    const [nameColumn, emailColumn, courseTitleColumn, instructorsColumn, createdColumn] = columns;

    expect(nameColumn).toHaveProperty('Header', 'Name');
    expect(nameColumn).toHaveProperty('accessor', 'learner_name');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'learner_email');

    expect(courseTitleColumn).toHaveProperty('Header', 'Course title');
    expect(courseTitleColumn).toHaveProperty('accessor', 'ccx_name');

    expect(instructorsColumn).toHaveProperty('Header', 'Instructors');
    expect(instructorsColumn).toHaveProperty('accessor', 'instructors');

    expect(createdColumn).toHaveProperty('Header', 'Created');
    expect(createdColumn).toHaveProperty('accessor', 'created');
  });
});
