import { columns, getColumns } from 'features/Licenses/LicenseDetailTable/columns';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(2);

    const [course, enrolled] = columns;

    expect(course).toHaveProperty('Header', 'Course');
    expect(course).toHaveProperty('accessor', 'masterCourseName');

    expect(enrolled).toHaveProperty('Header', 'Enrolled');
    expect(enrolled).toHaveProperty('accessor', 'numberOfStudents');
  });
});

describe('getColumns', () => {
  test('builds the program variation columns: license link, Consumed, Enrolled', () => {
    const result = getColumns({
      licenseName: 'Program License (Mock)',
      totalCourses: 12,
      to: '/programs/1',
    });

    expect(result).toHaveLength(3);

    const [licenseColumn, consumed, enrolled] = result;

    expect(licenseColumn).toHaveProperty('accessor', 'masterCourseName');
    expect(licenseColumn).toHaveProperty('disableSortBy', true);
    expect(typeof licenseColumn.Header).toBe('function');

    expect(consumed).toHaveProperty('Header', 'Consumed');
    expect(consumed).toHaveProperty('accessor', 'consumed');

    expect(enrolled).toHaveProperty('Header', 'Enrolled');
    expect(enrolled).toHaveProperty('accessor', 'numberOfStudents');
  });
});
