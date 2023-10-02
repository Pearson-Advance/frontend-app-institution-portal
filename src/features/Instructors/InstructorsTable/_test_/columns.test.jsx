import { columns } from 'features/Instructors/InstructorsTable/columns';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(5);

    const [
      usernameColumn,
      nameColumn,
      emailColumn,
      courseNameColumn,
      courseKeyColumn,
    ] = columns;

    expect(usernameColumn).toHaveProperty('Header', 'User Name');
    expect(usernameColumn).toHaveProperty('accessor', 'instructorUsername');

    expect(nameColumn).toHaveProperty('Header', 'Name');
    expect(nameColumn).toHaveProperty('accessor', 'instructorName');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'instructorEmail');

    expect(courseNameColumn).toHaveProperty('Header', 'Course key');
    expect(courseNameColumn).toHaveProperty('accessor', 'ccxId');

    expect(courseKeyColumn).toHaveProperty('Header', 'Course name');
    expect(courseKeyColumn).toHaveProperty('accessor', 'ccxName');
  });
});
