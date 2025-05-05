import { getColumns } from 'features/Instructors/InstructorsTable/columns';

describe('columns', () => {
  test('returns columns with correct properties', () => {
    const COLUMNS = getColumns(true);
    expect(COLUMNS).toHaveLength(6);

    const [
      nameColumn,
      lastSeenColumn,
      emailColumn,
      classesColumn,
      statusColumn,
    ] = COLUMNS;

    expect(nameColumn).toHaveProperty('Header', 'Instructor');
    expect(nameColumn).toHaveProperty('accessor', 'instructorName');

    expect(lastSeenColumn).toHaveProperty('Header', 'Last seen');
    expect(lastSeenColumn).toHaveProperty('accessor', 'lastAccess');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'instructorEmail');

    expect(classesColumn).toHaveProperty('Header', 'Courses Taught');
    expect(classesColumn).toHaveProperty('accessor', 'classes');

    expect(statusColumn).toHaveProperty('Header', 'Status');
    expect(statusColumn).toHaveProperty('accessor', 'active');
  });
});
