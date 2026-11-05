/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';

import { columns } from 'features/Programs/ProgramCoursesTable/columns';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('react-paragon-topaz', () => ({
  Badge: ({ children, variant, light }) => (
    <span data-testid="badge" data-variant={variant} data-light={String(light)}>
      {children}
    </span>
  ),
}));

jest.mock('features/Main/LinkWithQuery', () => ({
  __esModule: true,
  default: ({ to, children, className }) => (
    <a href={to} className={className} data-testid="course-name-link">
      {children}
    </a>
  ),
}));

describe('ProgramCoursesTable columns definition', () => {
  const mockLearningUrl = 'https://learning.example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    getConfig.mockReturnValue({
      LEARNING_MICROFRONTEND_URL: mockLearningUrl,
    });
  });

  const getColumn = (accessor) => columns.find((col) => col.accessor === accessor);

  describe('Actions column', () => {
    const actionsCol = getColumn('actions');

    test('renders action dropdown button and contains "Course content" link with correct href and targets', () => {
      const row = {
        original: {
          courseId: 'course-v1:EdX+Demo+2026',
        },
      };

      render(actionsCol.Cell({ row }));

      const toggleButton = screen.getByTestId('dropdown-action');
      expect(toggleButton).toBeInTheDocument();

      fireEvent.click(toggleButton);

      const courseContentLink = screen.getByRole('link', { name: /course content/i });
      expect(courseContentLink).toBeInTheDocument();
      expect(courseContentLink).toHaveAttribute(
        'href',
        `${mockLearningUrl}/course/${encodeURIComponent('course-v1:EdX+Demo+2026')}/home`,
      );
      expect(courseContentLink).toHaveAttribute('target', '_blank');
      expect(courseContentLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('handles empty LEARNING_MICROFRONTEND_URL gracefully', () => {
      getConfig.mockReturnValue({});

      const row = {
        original: {
          id: 'course-fallback-id',
        },
      };

      render(actionsCol.Cell({ row }));

      fireEvent.click(screen.getByTestId('dropdown-action'));

      const courseContentLink = screen.getByRole('link', { name: /course content/i });
      expect(courseContentLink).toHaveAttribute(
        'href',
        '/course/course-fallback-id/home',
      );
    });
  });

  describe('Course Name column', () => {
    const courseNameCol = getColumn('courseName');

    test('renders a link to course details with courseName', () => {
      const row = {
        original: {
          courseId: 'course-v1:Org+CS101+2026',
          courseName: 'Intro to Machine Learning',
        },
      };

      render(courseNameCol.Cell({ row }));

      const link = screen.getByTestId('course-name-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Intro to Machine Learning');
      expect(link).toHaveAttribute(
        'href',
        `/courses/${encodeURIComponent('course-v1:Org+CS101+2026')}`,
      );
    });

    test('falls back to courseTitle or id when courseName/courseId are alternative keys', () => {
      const row = {
        original: {
          id: 'course-alt-id',
          courseTitle: 'Alternative Title',
        },
      };

      render(courseNameCol.Cell({ row }));

      const link = screen.getByTestId('course-name-link');
      expect(link).toHaveTextContent('Alternative Title');
      expect(link).toHaveAttribute('href', '/courses/course-alt-id');
    });

    test('renders "-" if no title or name is provided', () => {
      const row = { original: { id: 'c-1' } };

      render(courseNameCol.Cell({ row }));

      const link = screen.getByTestId('course-name-link');
      expect(link).toHaveTextContent('-');
    });
  });

  describe('Sessions column', () => {
    const sessionsCol = getColumn('numberOfSessions');

    test('renders the numberOfSessions value', () => {
      const row = { original: { numberOfSessions: 5 } };
      render(sessionsCol.Cell({ row }));

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders 0 when numberOfSessions is undefined', () => {
      const row = { original: {} };
      render(sessionsCol.Cell({ row }));

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Instructor column', () => {
    const instructorCol = getColumn('instructors');

    test('renders a danger badge with missing count when missingClassesForInstructor > 0', () => {
      const row = {
        values: {
          missingClassesForInstructor: 3,
        },
      };

      render(instructorCol.Cell({ row }));

      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Missing (3)');
      expect(badge).toHaveAttribute('data-variant', 'danger');
      expect(badge).toHaveAttribute('data-light', 'true');
    });

    test('renders a success badge with "Ready" when missingClassesForInstructor is 0', () => {
      const row = {
        values: {
          missingClassesForInstructor: 0,
        },
      };

      render(instructorCol.Cell({ row }));

      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Ready');
      expect(badge).toHaveAttribute('data-variant', 'success');
      expect(badge).toHaveAttribute('data-light', 'true');
    });

    test('renders a success badge with "Ready" when missingClassesForInstructor is undefined or null', () => {
      const row = {
        values: {},
      };

      render(instructorCol.Cell({ row }));

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('Ready');
      expect(badge).toHaveAttribute('data-variant', 'success');
    });
  });

  describe('Students Enrolled column', () => {
    const studentsCol = getColumn('numberOfStudents');

    test('renders numberOfStudents when present', () => {
      const row = { original: { numberOfStudents: 34 } };
      render(studentsCol.Cell({ row }));

      expect(screen.getByText('34')).toBeInTheDocument();
    });

    test('falls back to enrolledStudents if numberOfStudents is not provided', () => {
      const row = { original: { enrolledStudents: 12 } };
      render(studentsCol.Cell({ row }));

      expect(screen.getByText('12')).toBeInTheDocument();
    });

    test('renders 0 when neither field is present', () => {
      const row = { original: {} };
      render(studentsCol.Cell({ row }));

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
