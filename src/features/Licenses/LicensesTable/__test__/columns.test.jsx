import { columns } from 'features/Licenses/LicensesTable/columns';

describe('columns in license table', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(5);

    const [
      licenseName,
      purchasedSeats,
      numberOfStudents,
      pendingStudents,
      numberOfPendingStudents,
    ] = columns;

    expect(licenseName).toHaveProperty('Header', 'License Pool');
    expect(licenseName).toHaveProperty('accessor', 'licenseName');

    expect(purchasedSeats).toHaveProperty('Header', 'Purchased');
    expect(purchasedSeats).toHaveProperty('accessor', 'purchasedSeats');

    expect(numberOfStudents).toHaveProperty('Header', 'Enrolled');
    expect(numberOfStudents).toHaveProperty('accessor', 'numberOfStudents');

    expect(pendingStudents).toHaveProperty('Header', 'Pending');
    expect(pendingStudents).toHaveProperty('accessor', 'numberOfPendingStudents');

    expect(numberOfPendingStudents).toHaveProperty('Header', 'Remaining');
    expect(numberOfPendingStudents).toHaveProperty('accessor', 'remaining');
  });
});
