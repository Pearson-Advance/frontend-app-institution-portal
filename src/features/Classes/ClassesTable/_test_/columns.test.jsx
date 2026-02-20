import { fireEvent } from '@testing-library/react';

import { columns } from 'features/Classes/ClassesTable/columns';
import { renderWithProviders } from 'test-utils';

import * as classesThunks from 'features/Classes/data/thunks';

describe('columns', () => {
  const classDataMock = {
    masterCourseName: 'course example',
    masterCourseId: 'demo course',
    classId: 'class 01',
    className: 'class example',
    startDate: '',
    endDate: '',
    minStudents: 10,
    maxStudents: 100,
  };

  beforeEach(() => {
    jest.spyOn(classesThunks, 'supersetUrlClassesDashboard').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(9);

    const [
      classNameColumn,
      courseTitle,
      instructor,
      minStudentsAllowed,
      maxStudents,
      studentsEnrolled,
      startDate,
      endDate,
    ] = columns;

    expect(classNameColumn).toHaveProperty('Header', 'Class');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(instructor).toHaveProperty('Header', 'Instructor');
    expect(instructor).toHaveProperty('accessor', 'instructors');

    expect(minStudentsAllowed).toHaveProperty('Header', 'Min');
    expect(minStudentsAllowed).toHaveProperty('accessor', 'minStudentsAllowed');

    expect(courseTitle).toHaveProperty('Header', 'Course Title');
    expect(courseTitle).toHaveProperty('accessor', 'masterCourseName');

    expect(studentsEnrolled).toHaveProperty('Header', 'Students Enrolled');
    expect(studentsEnrolled).toHaveProperty('accessor', 'numberOfStudents');

    expect(maxStudents).toHaveProperty('Header', 'Max');
    expect(maxStudents).toHaveProperty('accessor', 'maxStudents');

    expect(startDate).toHaveProperty('Header', 'Start Date');
    expect(startDate).toHaveProperty('accessor', 'startDate');

    expect(endDate).toHaveProperty('Header', 'End Date');
    expect(endDate).toHaveProperty('accessor', 'endDate');
  });

  test('Show menu dropdown', async () => {
    const ActionColumn = () => columns[8].Cell({
      row: {
        values: {
          masterCourseName: 'course example',
        },
        original: { ...classDataMock },
      },
    });

    const mockStore = {
      classes: {
        table: {
          data: [
            { ...classDataMock },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
        allClasses: {
          data: [
            { ...classDataMock },
          ],
        },
      },
    };

    const { getByText, getByTestId, getAllByRole } = renderWithProviders(<ActionColumn />, {
      preloadedState: mockStore,
      initialEntries: ['/classes/'],
    });

    const button = getByTestId('droprown-action');
    fireEvent.click(button);
    const editButton = getAllByRole('button')[2];
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(getByText('View class content')).toBeInTheDocument();
    expect(getByText('Manage Instructors')).toBeInTheDocument();
    expect(getByText('Edit Class')).toBeInTheDocument();
    expect(getByText('Gradebook')).toBeInTheDocument();
    expect(getByText('Enroll student')).toBeInTheDocument();
    expect(getByText('Delete Class')).toBeInTheDocument();
  });

  test('Show Lab Dashboard option when link is sent', async () => {
    const ActionColumn = () => columns[8].Cell({
      row: {
        values: {
          masterCourseName: 'course example',
        },
        original: {
          ...classDataMock,
          labSummaryTag: 'skillable-dashboard',
        },
      },
    });

    const mockStore = {
      classes: {
        table: {
          data: [
            { ...classDataMock, labSummaryTag: 'skillable-dashboard' },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
        allClasses: {
          data: [
            { ...classDataMock },
          ],
        },
      },
    };

    const { getByText, getByTestId } = renderWithProviders(<ActionColumn />, {
      preloadedState: mockStore,
      initialEntries: ['/classes/'],
    });

    const button = getByTestId('droprown-action');
    fireEvent.click(button);
    expect(getByText('Lab Dashboard')).toBeInTheDocument();
  });

  test('shows “Classes Insights (Beta)” when a dashboard URL is available', async () => {
    classesThunks.supersetUrlClassesDashboard.mockResolvedValue(
      'https://superset.example.com/dashboard/42',
    );

    const ActionColumn = () => columns[8].Cell({
      row: {
        values: { masterCourseName: 'course example' },
        original: { ...classDataMock },
      },
    });

    const mockStore = {
      classes: {
        table: {
          data: [{ ...classDataMock }],
          count: 1,
          num_pages: 1,
          current_page: 1,
        },
        allClasses: {
          data: [{ ...classDataMock }],
        },
      },
    };

    const { getByTestId, findByText } = renderWithProviders(<ActionColumn />, {
      preloadedState: mockStore,
      initialEntries: ['/classes/'],
    });

    fireEvent.click(getByTestId('droprown-action'));

    expect(await findByText('Classes Insights (Beta)')).toBeInTheDocument();
  });
});
