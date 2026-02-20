import {
  fireEvent,
  screen,
} from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import { columns } from 'features/Courses/CourseDetailTable/columns';
import { RequestStatus } from 'features/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const basePath = `/courses/${encodeURIComponent(
  'course-v1:XXX+YYY+2023',
)}`;

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(9);

    const [
      className,
      courseTitle,
      instructor,
      minStudentsAllowed,
      maxStudents,
      studentsEnrolled,
      startDate,
      endDate,
    ] = columns;

    expect(className).toHaveProperty('Header', 'Class');
    expect(className).toHaveProperty('accessor', 'className');

    expect(courseTitle).toHaveProperty('Header', 'Course Title');
    expect(courseTitle).toHaveProperty('accessor', 'masterCourseName');

    expect(instructor).toHaveProperty('Header', 'Instructor');
    expect(instructor).toHaveProperty('accessor', 'instructors');

    expect(minStudentsAllowed).toHaveProperty('Header', 'Min');
    expect(minStudentsAllowed).toHaveProperty('accessor', 'minStudentsAllowed');

    expect(maxStudents).toHaveProperty('Header', 'Max');
    expect(maxStudents).toHaveProperty('accessor', 'maxStudents');

    expect(studentsEnrolled).toHaveProperty('Header', 'Students Enrolled');
    expect(studentsEnrolled).toHaveProperty('accessor', 'numberOfStudents');

    expect(startDate).toHaveProperty('Header', 'Start date');
    expect(startDate).toHaveProperty('accessor', 'startDate');

    expect(endDate).toHaveProperty('Header', 'End date');
    expect(endDate).toHaveProperty('accessor', 'endDate');
  });

  test('Should render the title into a span tag', () => {
    const Component = () => columns[0].Cell({
      row: {
        values: {
          className: 'Class example',
        },
        original: {
          classId: 'class id',
        },
      },
    });

    renderWithProviders(
      <Route
        path="/courses/:courseId"
        element={<Component />}
      />,
      {
        initialEntries: [basePath],
        preloadedState: {},
      },
    );

    const linkElement = screen.getByText('Class example');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass('text-truncate link');
    expect(linkElement).toHaveAttribute('href');
    expect(linkElement.getAttribute('href')).toContain('course-v1:XXX+YYY+2023');
    expect(linkElement.getAttribute('href')).toContain('class%20id');
    expect(linkElement.getAttribute('href')).toContain('previous=courses');
  });

  test('Should render the dates', () => {
    const startDate = columns[6].Cell({ row: { values: { startDate: '2024-02-13T17:42:22Z' } } });
    expect(startDate).toBe('02/13/24');

    const endDate = columns[6].Cell({ row: { values: { startDate: '2024-04-13T17:42:22Z' } } });
    expect(endDate).toBe('04/13/24');

    const nullDate = columns[6].Cell({ row: { values: { startDate: null } } });
    expect(nullDate).toBe('-');

    const nullDate2 = columns[7].Cell({ row: { values: { startDate: null } } });
    expect(nullDate2).toBe('-');
  });

  test('Should render the students enrolled', () => {
    const values = { row: { values: { numberOfStudents: 3, numberOfPendingStudents: 1 } } };

    const studentsEnrolled = columns[5].Cell(values);
    expect(studentsEnrolled).toHaveProperty('type', 'span');
    expect(studentsEnrolled.props).toEqual({ children: 3 });
  });

  test('Should render the instructors', () => {
    const values = {
      row: {
        values: { instructors: ['Sam Sepiol'] },
        original: {
          classId: 'Demo Course 1',
        },
      },
    };

    const Component = () => columns[2].Cell(values);
    const mockStore = {
      courses: {
        newClass: {
          status: RequestStatus.INITIAL,
        },
      },
      classes: {
        table: {
          data: [
            {
              masterCourseName: 'Demo MasterCourse 1',
              className: 'Demo Class 1',
              startDate: '09/21/24',
              endDate: null,
              numberOfStudents: 1,
              maxStudents: 100,
              instructors: ['Sam Sepiol'],
            },
            {
              masterCourseName: 'Demo MasterCourse 2',
              className: 'Demo Class 2',
              startDate: '09/21/25',
              endDate: null,
              numberOfStudents: 2,
              maxStudents: 200,
              instructors: [],
            },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const { getByText } = renderWithProviders(
      <Route
        path="/courses/:courseId"
        element={<Component />}
      />,
      {
        initialEntries: [basePath],
        preloadedState: mockStore,
      },
    );

    expect(getByText('Sam Sepiol')).toBeInTheDocument();
  });

  test('Should render the label text if instructor is not present', async () => {
    const values = {
      row: {
        values: { instructors: [] },
        original: {
          classId: 'Demo Course 1',
        },
      },
    };

    const ComponentNoInstructor = () => columns[2].Cell(values);

    const mockStore = {
      courses: {
        newClass: {
          status: RequestStatus.INITIAL,
        },
      },
      classes: {
        table: {
          data: [
            {
              masterCourseName: 'Demo MasterCourse 1',
              className: 'Demo Class 1',
              startDate: '09/21/24',
              endDate: null,
              numberOfStudents: 1,
              maxStudents: 100,
              instructors: ['Sam Sepiol'],
            },
            {
              masterCourseName: 'Demo MasterCourse 2',
              className: 'Demo Class 2',
              startDate: '09/21/25',
              endDate: null,
              numberOfStudents: 2,
              maxStudents: 200,
              instructors: [],
            },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const { getByText } = renderWithProviders(
      <Route
        path="/courses/:courseId"
        element={<ComponentNoInstructor />}
      />,
      {
        initialEntries: [basePath],
        preloadedState: mockStore,
      },
    );

    const title = getByText('Unassigned');
    expect(title).toBeInTheDocument();
  });

  test('Should render the dropdown menu', () => {
    const values = {
      row: {
        values: { instructors: ['Sam Sepiol'] },
        original: {
          classId: 'Demo Course 1',
        },
      },
    };

    const Component = () => columns[8].Cell(values);
    const mockStore = {
      courses: {
        newClass: {
          status: RequestStatus.INITIAL,
        },
      },
      classes: {
        table: {
          data: [
            {
              masterCourseName: 'Demo MasterCourse 1',
              classId: 'cxx-demo-id',
              className: 'Demo Class 1',
              startDate: '09/21/24',
              endDate: null,
              numberOfStudents: 1,
              maxStudents: 100,
              instructors: ['Sam Sepiol'],
            },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
        allClasses: {
          data: [
            {
              masterCourseName: 'Demo MasterCourse 1',
              classId: 'cxx-demo-id',
              className: 'Demo Class 1',
              startDate: '09/21/24',
              endDate: null,
              numberOfStudents: 1,
              maxStudents: 100,
              instructors: ['Sam Sepiol'],
            },
          ],
        },
      },
    };

    const { getByTestId, getByText } = renderWithProviders(
      <Route
        path="/courses/:courseId"
        element={<Component />}
      />,
      {
        initialEntries: [basePath],
        preloadedState: mockStore,
      },
    );

    const buttonTrigger = getByTestId('droprown-action');

    fireEvent.click(buttonTrigger);

    expect(getByText('View class content')).toBeInTheDocument();
    expect(getByText('Manage Instructors')).toBeInTheDocument();
    expect(getByText('Edit Class')).toBeInTheDocument();
    expect(getByText('Delete Class')).toBeInTheDocument();

    const deleteButton = getByText('Delete Class');

    fireEvent.click(deleteButton);
    expect(screen.getByText(/This action will permanently delete this class/i)).toBeInTheDocument();
  });
});
