import { getColumns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  test('returns an array of columns with correct properties', () => {
    const columns = getColumns();

    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(5);

    const [
      nameColumn,
      emailColumn,
      classNameColumn,
      ClassIdColumn,
      examReadyColumn,
    ] = columns;

    expect(nameColumn).toHaveProperty('Header', 'Student');
    expect(nameColumn).toHaveProperty('accessor', 'learnerName');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'learnerEmail');

    expect(classNameColumn).toHaveProperty('Header', 'Class Name');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(ClassIdColumn).toHaveProperty('Header', 'Class Id');
    expect(ClassIdColumn).toHaveProperty('accessor', 'classId');

    expect(examReadyColumn).toHaveProperty('Header', 'Exam Ready');
    expect(examReadyColumn).toHaveProperty('accessor', 'examReady');
  });
});
