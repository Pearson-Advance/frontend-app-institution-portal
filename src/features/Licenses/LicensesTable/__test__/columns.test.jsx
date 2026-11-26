import { columns, getColumns } from 'features/Licenses/LicensesTable/columns';

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

describe('getColumns in license table', () => {
  test('returns the base columns when Offerings data is disabled', () => {
    expect(getColumns(false)).toEqual(columns);
    expect(getColumns()).toHaveLength(5);
  });

  test('adds the Type column when Offerings data is enabled', () => {
    const result = getColumns(true);

    expect(result).toHaveLength(6);
    expect(result.map((column) => column.Header)).toEqual([
      'License Pool',
      'Type',
      'Purchased',
      'Enrolled',
      'Pending',
      'Remaining',
    ]);

    const typeColumn = result.find((column) => column.Header === 'Type');

    expect(typeColumn).toHaveProperty('accessor', 'licenseType');
    expect(result.find((column) => column.Header === 'Consumed')).toBeUndefined();
  });
});
