import '@testing-library/jest-dom/extend-expect';

import { columns } from 'features/Class/ClassPage/columns';

describe('columns', () => {
  test('Should return an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(6);

    const [
      number,
      student,
      learnerEmail,
      status,
      completePercentage,
      examReady,
    ] = columns;

    expect(number).toHaveProperty('Header', 'No');
    expect(number).toHaveProperty('accessor', 'index');

    expect(student).toHaveProperty('Header', 'Student');
    expect(student).toHaveProperty('accessor', 'learnerName');

    expect(learnerEmail).toHaveProperty('Header', 'Email');
    expect(learnerEmail).toHaveProperty('accessor', 'learnerEmail');

    expect(status).toHaveProperty('Header', 'Status');
    expect(status).toHaveProperty('accessor', 'status');

    expect(completePercentage).toHaveProperty('Header', 'Courseware Progress');
    expect(completePercentage).toHaveProperty('accessor', 'completePercentage');

    expect(examReady).toHaveProperty('Header', 'Exam ready');
    expect(examReady).toHaveProperty('accessor', 'examReady');
  });
});
