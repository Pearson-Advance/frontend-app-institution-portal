/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { columns } from 'features/Sessions/SessionDetailTable/columns';

jest.mock('helpers', () => ({
  formatUTCDate: jest.fn((date) => `formatted-${date}`),
  formatInstructorsWithStatus: jest.fn((instructors) => instructors?.map((i) => i.name) || []),
}));

jest.mock('features/Courses/AddClass', () => function MockAddClass({ isOpen, isEditing }) {
  return isOpen ? <div data-testid="add-class-modal">AddClass Modal (isEditing: {String(isEditing)})</div> : null;
});

jest.mock('features/Main/LinkWithQuery', () => function MockLinkWithQuery({ to, children, className }) {
  return <a href={to} className={className}>{children}</a>;
});

describe('SessionDetailTable columns', () => {
  const mockRowData = {
    classId: 'class-123',
    className: 'CS101 - Section A',
    courseName: 'Intro to CS',
    masterCourseId: 'course-v1:EdX+CS101',
    masterCourseName: 'Intro to CS Master',
    minStudents: 10,
    maxStudents: 30,
    numberOfStudents: 20,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    instructorsWithStatus: [
      { name: 'Dr. Jane Doe', status: 'assigned' },
      { name: 'Prof. Alan Turing', status: 'assigned' },
    ],
  };

  const createCellProps = (columnAccessor, customData = {}) => {
    const data = { ...mockRowData, ...customData };
    return {
      row: {
        original: data,
        values: {
          className: data.className,
          courseName: data.courseName,
          minStudents: data.minStudents,
          maxStudents: data.maxStudents,
          numberOfStudents: data.numberOfStudents,
          startDate: data.startDate,
          endDate: data.endDate,
        },
      },
    };
  };

  const renderCell = (columnHeader, props) => {
    const column = columns.find((col) => col.Header === columnHeader || col.accessor === columnHeader);
    const CellComponent = column.Cell;

    return render(
      <MemoryRouter>
        <CellComponent {...props} />
      </MemoryRouter>,
    );
  };

  describe('Actions Column', () => {
    it('renders dropdown button and handles opening "Edit Class" modal', () => {
      const props = createCellProps('actions');
      renderCell('', props);

      const dropdownBtn = screen.getByTestId('dropdown-action');
      expect(dropdownBtn).toBeInTheDocument();

      fireEvent.click(dropdownBtn);

      const editOption = screen.getByText('Edit class');
      const manageOption = screen.getByText('Manage Instructors');

      expect(editOption).toBeInTheDocument();
      expect(manageOption).toBeInTheDocument();

      fireEvent.click(editOption);
      expect(screen.getByTestId('add-class-modal')).toBeInTheDocument();
    });

    it('renders correct link path for Manage Instructors option', () => {
      const props = createCellProps('actions');
      renderCell('', props);

      const dropdownBtn = screen.getByTestId('dropdown-action');
      fireEvent.click(dropdownBtn);

      const manageLink = screen.getByText('Manage Instructors').closest('a');
      expect(manageLink).toHaveAttribute(
        'href',
        `/manage-instructors/${encodeURIComponent(mockRowData.masterCourseId)}/${encodeURIComponent(mockRowData.classId)}`,
      );
    });
  });

  describe('Data Columns', () => {
    it('renders Class Name and Course Name correctly', () => {
      const classNameProps = createCellProps('className');
      renderCell('Class Name', classNameProps);
      expect(screen.getByText(mockRowData.className)).toBeInTheDocument();

      const courseNameProps = createCellProps('courseName');
      renderCell('Course Name', courseNameProps);
      expect(screen.getByText(mockRowData.courseName)).toBeInTheDocument();
    });

    it('renders instructors list when instructors are assigned', () => {
      const props = createCellProps('instructors');
      renderCell('Instructors', props);

      expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Prof. Alan Turing')).toBeInTheDocument();
    });

    it('renders "Unassigned" when no instructors are provided', () => {
      const props = createCellProps('instructors', { instructorsWithStatus: [] });
      renderCell('Instructors', props);

      const unassignedSpan = screen.getByText('Unassigned');
      expect(unassignedSpan).toBeInTheDocument();
      expect(unassignedSpan).toHaveClass('text-danger');
    });

    it('renders Min, Max, and Students Enrolled values', () => {
      renderCell('Min', createCellProps('minStudents'));
      expect(screen.getByText('10')).toBeInTheDocument();

      renderCell('Max', createCellProps('maxStudents'));
      expect(screen.getByText('30')).toBeInTheDocument();

      renderCell('Students Enrolled', createCellProps('numberOfStudents'));
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders formatted Start Date and End Date', () => {
      renderCell('Start date', createCellProps('startDate'));
      expect(screen.getByText(`formatted-${mockRowData.startDate}`)).toBeInTheDocument();

      renderCell('End date', createCellProps('endDate'));
      expect(screen.getByText(`formatted-${mockRowData.endDate}`)).toBeInTheDocument();
    });
  });
});
