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

  test('adds Type and Consumed columns when Offerings data is enabled', () => {
    const result = getColumns(true);

    expect(result).toHaveLength(7);
    expect(result.map((column) => column.Header)).toEqual([
      'License Pool',
      'Type',
      'Purchased',
      'Consumed',
      'Enrolled',
      'Pending',
      'Remaining',
    ]);

    const typeColumn = result.find((column) => column.Header === 'Type');
    const consumedColumn = result.find((column) => column.Header === 'Consumed');

    expect(typeColumn).toHaveProperty('accessor', 'type');
    expect(consumedColumn).toHaveProperty('accessor', 'consumed');
  });
});
