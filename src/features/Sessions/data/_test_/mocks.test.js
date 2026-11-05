import { getConfig } from '@edx/frontend-platform';

import {
  isOfferingsFlagEnabled,
  isSessionMockCourse,
  getMockSessionClasses,
  isSessionMockClass,
  getMockSessionStudents,
} from 'features/Sessions/data/mocks';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('Sessions data mocks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('isOfferingsFlagEnabled reflects the PSS_ENABLE_OFFERINGS flag', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_OFFERINGS: true });
    expect(isOfferingsFlagEnabled()).toBe(true);

    getConfig.mockReturnValue({});
    expect(isOfferingsFlagEnabled()).toBe(false);
  });

  it('identifies seeded session courses and returns their classes', () => {
    expect(isSessionMockCourse('course-v1:EdX+CS101+2026')).toBe(true);
    expect(isSessionMockCourse('course-v1:Real+Course+2026')).toBe(false);

    const classes = getMockSessionClasses('course-v1:EdX+CS101+2026');
    expect(classes).toHaveLength(1);
    expect(classes[0]).toHaveProperty('classId', 'class-101-a');
  });

  it('identifies seeded session classes and returns their students', () => {
    expect(isSessionMockClass('class-101-a')).toBe(true);
    expect(isSessionMockClass('unknown-class')).toBe(false);

    const students = getMockSessionStudents('class-101-a');
    expect(students.count).toBe(students.results.length);
    expect(students.numPages).toBe(1);
    expect(students.results[0]).toHaveProperty('learnerName');
  });

  it('returns an empty students payload for an unknown class', () => {
    const students = getMockSessionStudents('unknown-class');
    expect(students.results).toEqual([]);
    expect(students.count).toBe(0);
  });
});
