import {
  fireEvent,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import { columns } from 'features/Courses/CourseDetailTable/columns';

describe('columns', () => {
  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(9);

    const [
      className,
      instructor,
      enrollmentStatus,
      minStudentsAllowed,
      studentsEnrolled,
      maxStudents,
      startDate,
      endDate,
    ] = columns;

    expect(className).toHaveProperty('Header', 'Class');
    expect(className).toHaveProperty('accessor', 'className');

    expect(instructor).toHaveProperty('Header', 'Instructor');
    expect(instructor).toHaveProperty('accessor', 'instructors');

    expect(minStudentsAllowed).toHaveProperty('Header', 'Min');
    expect(minStudentsAllowed).toHaveProperty('accessor', 'minStudentsAllowed');

    expect(enrollmentStatus).toHaveProperty('Header', 'Enrollment status');
    expect(enrollmentStatus).toHaveProperty('accessor', 'numberOfPendingStudents');

    expect(studentsEnrolled).toHaveProperty('Header', 'Students Enrolled');
    expect(studentsEnrolled).toHaveProperty('accessor', 'numberOfStudents');

    expect(maxStudents).toHaveProperty('Header', 'Max');
    expect(maxStudents).toHaveProperty('accessor', 'maxStudents');

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
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201']}>
        <Route path="/courses/:courseId">
          <Component />
        </Route>
      </MemoryRouter>,
      { preloadedState: {} },
    );

    const linkElement = screen.getByText('Class example');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass('text-truncate link');
    expect(linkElement).toHaveAttribute('href', '/courses/Demo Course 1/Class example?classId=class%20id&previous=courses');
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

  test('Should render the enrollment status', () => {
    const pendingStudents = { row: { values: { numberOfStudents: 3, numberOfPendingStudents: 1 } } };

    const enrollmentStatus = columns[2].Cell(pendingStudents);
    expect(enrollmentStatus.props).toEqual({
      children: ['Pending (', 1, ')'], light: true, variant: 'warning', className: '', small: false,
    });

    const completeStudents = { row: { values: { numberOfStudents: 3, numberOfPendingStudents: 0 } } };

    const enrollmentStatusComplete = columns[2].Cell(completeStudents);
    expect(enrollmentStatusComplete.props).toEqual({
      children: 'Complete', light: true, variant: 'success', className: '', small: false,
    });
  });

  test('Should render the students enrolled', () => {
    const values = { row: { values: { numberOfStudents: 3, numberOfPendingStudents: 1 } } };

    const studentsEnrolled = columns[4].Cell(values);
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

    const Component = () => columns[1].Cell(values);
    const mockStore = {
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

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201']}>
        <Route path="/courses/:courseId">
          <Component />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(component.getByText('Sam Sepiol')).toBeInTheDocument();
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

    const ComponentNoInstructor = () => columns[1].Cell(values);

    const mockStore = {
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

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201']}>
        <Route path="/courses/:courseId">
          <ComponentNoInstructor />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const title = component.getByText('Unassigned');
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
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/courses/Demo%20Course%201']}>
        <Route path="/courses/:courseId">
          <Component />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const buttonTrigger = component.getByTestId('droprown-action');

    fireEvent.click(buttonTrigger);

    expect(component.getByText('View class content')).toBeInTheDocument();
    expect(component.getByText('Manage Instructors')).toBeInTheDocument();
    expect(component.getByText('Edit Class')).toBeInTheDocument();
  });
});
