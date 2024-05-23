import '@testing-library/jest-dom/extend-expect';

import { columns } from 'features/Instructors/ManageInstructors/columns';

describe('columns', () => {
  test('Should return an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(3);

    const [
      instructor,
      lastSeen,
      coursesTaught,
    ] = columns;

    expect(instructor).toHaveProperty('Header', 'Instructor');
    expect(instructor).toHaveProperty('accessor', 'instructorName');

    expect(lastSeen).toHaveProperty('Header', 'Last seen');
    expect(lastSeen).toHaveProperty('accessor', 'lastAccess');

    expect(coursesTaught).toHaveProperty('Header', 'Courses Taught');
    expect(coursesTaught).toHaveProperty('accessor', 'classes');
  });
});
