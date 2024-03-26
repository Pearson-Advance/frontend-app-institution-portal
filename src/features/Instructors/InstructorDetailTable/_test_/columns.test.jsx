import { columns } from 'features/Instructors/InstructorDetailTable/columns';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(4);

    const [
      classColumn,
      courseColumn,
      startEndDateColumn,
      statusColumn,
    ] = columns;

    expect(classColumn).toHaveProperty('Header', 'Class');
    expect(classColumn).toHaveProperty('accessor', 'className');

    expect(courseColumn).toHaveProperty('Header', 'Course');
    expect(courseColumn).toHaveProperty('accessor', 'masterCourseName');

    expect(startEndDateColumn).toHaveProperty('Header', 'Start - End Date');
    expect(startEndDateColumn).toHaveProperty('accessor', 'startDate');

    expect(statusColumn).toHaveProperty('Header', 'Status');
    expect(statusColumn).toHaveProperty('accessor', 'status');
  });
});
