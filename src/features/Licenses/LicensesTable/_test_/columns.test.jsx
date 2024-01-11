import { columns } from 'features/Licenses/LicensesTable/columns';

describe('columns in license table', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(4);

    const [
      nameColumn,
      purchasedColumn,
      enrolledColumn,
      remainingColumn,
    ] = columns;

    expect(nameColumn).toHaveProperty('Header', 'License Pool');
    expect(nameColumn).toHaveProperty('accessor', 'licenseName');

    expect(purchasedColumn).toHaveProperty('Header', 'Purchased');
    expect(purchasedColumn).toHaveProperty('accessor', 'purchasedSeats');

    expect(enrolledColumn).toHaveProperty('Header', 'Enrolled');
    expect(enrolledColumn).toHaveProperty('accessor', 'numberOfStudents');

    expect(remainingColumn).toHaveProperty('Header', 'Remaining');
    expect(remainingColumn).toHaveProperty('accessor', 'numberOfPendingStudents');
  });
});
