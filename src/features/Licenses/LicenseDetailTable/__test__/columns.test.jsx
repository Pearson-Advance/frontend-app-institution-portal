import { columns } from 'features/Licenses/LicenseDetailTable/columns';

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
