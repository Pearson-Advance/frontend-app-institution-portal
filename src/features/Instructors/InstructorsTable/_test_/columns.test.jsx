import { columns } from 'features/Instructors/InstructorsTable/columns';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(4);

    const [
      usernameColumn,
      lastSeenColumn,
      emailColumn,
      classesColumn,
    ] = columns;

    expect(usernameColumn).toHaveProperty('Header', 'Instructor');
    expect(usernameColumn).toHaveProperty('accessor', 'instructorUsername');

    expect(lastSeenColumn).toHaveProperty('Header', 'Last seen');
    expect(lastSeenColumn).toHaveProperty('accessor', 'lastAccess');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'instructorEmail');

    expect(classesColumn).toHaveProperty('Header', 'Courses Taught');
    expect(classesColumn).toHaveProperty('accessor', 'classes');
  });
});
