import { columns } from 'features/Instructors/ManageInstructors/columns';

describe('columns', () => {
  test('Should return an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(4);

    const [
      instructor,
      instructorEmail,
      lastSeen,
      coursesTaught,
    ] = columns;

    expect(instructor).toHaveProperty('Header', 'Instructor');
    expect(instructor).toHaveProperty('accessor', 'instructorName');

    expect(instructorEmail).toHaveProperty('Header', 'Email');
    expect(instructorEmail).toHaveProperty('accessor', 'instructorEmail');

    expect(lastSeen).toHaveProperty('Header', 'Last seen');
    expect(lastSeen).toHaveProperty('accessor', 'lastAccess');

    expect(coursesTaught).toHaveProperty('Header', 'Courses Taught');
    expect(coursesTaught).toHaveProperty('accessor', 'classes');
  });
});
