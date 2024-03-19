import { columns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(6);

    const [
      nameColumn,
      emailColumn,
      classNameColumn,
      dateColumn,
      progressColumn,
      examReadyColumn,
    ] = columns;

    expect(nameColumn).toHaveProperty('Header', 'Student');
    expect(nameColumn).toHaveProperty('accessor', 'learnerName');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'learnerEmail');

    expect(classNameColumn).toHaveProperty('Header', 'Class Name');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(dateColumn).toHaveProperty('Header', 'Start - End Date');
    expect(dateColumn).toHaveProperty('accessor', 'startDate');

    expect(progressColumn).toHaveProperty('Header', 'Progress');
    expect(progressColumn).toHaveProperty('accessor', 'completePercentage');

    expect(examReadyColumn).toHaveProperty('Header', 'Exam Ready');
    expect(examReadyColumn).toHaveProperty('accessor', 'examReady');
  });
});
