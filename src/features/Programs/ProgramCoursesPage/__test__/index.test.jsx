import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  useGetProgramDetailQuery,
  useGetCoursesByProgramQuery,
} from 'features/Programs/data/programsApi';
import { useInstitutionIdQueryParam } from 'hooks';

import ProgramCoursesPage from 'features/Programs/ProgramCoursesPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('hooks', () => ({
  useInstitutionIdQueryParam: jest.fn(),
}));

jest.mock('features/Programs/data/programsApi', () => ({
  useGetProgramDetailQuery: jest.fn(),
  useGetCoursesByProgramQuery: jest.fn(),
}));

jest.mock('features/Main/LinkWithQuery', () => ({
  __esModule: true,
  default: ({ to, children, className }) => (
    <a href={to} className={className} data-testid="link-with-query">
      {children}
    </a>
  ),
}));

jest.mock('features/Programs/ProgramCoursesTable', () => ({
  __esModule: true,
  default: ({ isLoading, count, data }) => (
    <div data-testid="program-courses-table">
      <span>Loading: {isLoading ? 'true' : 'false'}</span>
      <span>Count: {count}</span>
      <span>Items: {data.length}</span>
    </div>
  ),
}));

describe('ProgramCoursesPage', () => {
  const mockNavigate = jest.fn();
  const mockAddQueryParam = jest.fn((path) => `${path}?institution_id=inst-1`);

  const mockProgramInfo = {
    programTitle: 'Artificial Intelligence Certificate',
    purchasedSeats: 150,
    consumedSeats: 90,
    enrolledStudents: 85,
    remainingSeats: 60,
  };

  const mockCoursesResponse = {
    count: 2,
    numPages: 2,
    results: [
      { id: 'course-1', courseName: 'Machine Learning 101' },
      { id: 'course-2', courseName: 'Deep Learning Basics' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ programId: encodeURIComponent('prog:test-123') });
    useInstitutionIdQueryParam.mockReturnValue(mockAddQueryParam);
    useSelector.mockReturnValue({ id: 'inst-1' });

    useGetProgramDetailQuery.mockReturnValue({
      data: mockProgramInfo,
      isLoading: false,
    });

    useGetCoursesByProgramQuery.mockReturnValue({
      data: mockCoursesResponse,
      isLoading: false,
    });
  });

  test('renders back navigation link to /programs', () => {
    render(<ProgramCoursesPage />);

    const backLink = screen.getByTestId('link-with-query');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/programs');
  });

  test('renders the decoded program title in the header', () => {
    render(<ProgramCoursesPage />);

    expect(
      screen.getByRole('heading', {
        name: `Program: ${mockProgramInfo.programTitle}`,
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  test('renders all license/seat metric cards with correct values', () => {
    render(<ProgramCoursesPage />);

    expect(screen.getByText('Purchased')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();

    expect(screen.getByText('Consumed')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();

    expect(screen.getByText('Enrolled')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();

    expect(screen.getByText('Remaining')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  test('renders fallback zeros when metric values are undefined', () => {
    useGetProgramDetailQuery.mockReturnValue({
      data: {
        programTitle: 'Empty Metrics Program',
        purchasedSeats: undefined,
        consumedSeats: undefined,
        enrolledStudents: undefined,
        remainingSeats: undefined,
      },
      isLoading: false,
    });

    render(<ProgramCoursesPage />);

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(4);
  });

  test('passes course data and loading state to ProgramCoursesTable', () => {
    render(<ProgramCoursesPage />);

    const table = screen.getByTestId('program-courses-table');
    expect(table).toBeInTheDocument();
    expect(screen.getByText('Loading: false')).toBeInTheDocument();
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
    expect(screen.getByText('Items: 2')).toBeInTheDocument();
  });

  test('renders pagination controls when numPages > 1 and updates current page on click', () => {
    render(<ProgramCoursesPage />);

    const pageTwoButton = screen.getByRole('button', { name: /page 2/i });
    expect(pageTwoButton).toBeInTheDocument();

    fireEvent.click(pageTwoButton);

    expect(useGetCoursesByProgramQuery).toHaveBeenLastCalledWith(
      {
        institutionId: 'inst-1',
        programId: 'prog:test-123',
        page: 2,
      },
      { skip: false },
    );
  });

  test('does not render pagination when numPages is 1 or less', () => {
    useGetCoursesByProgramQuery.mockReturnValue({
      data: { ...mockCoursesResponse, numPages: 1 },
      isLoading: false,
    });

    render(<ProgramCoursesPage />);

    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
  });

  test('redirects back to /programs when the active institution changes', () => {
    const { rerender } = render(<ProgramCoursesPage />);

    expect(mockNavigate).not.toHaveBeenCalled();

    useSelector.mockReturnValue({ id: 'inst-2' });
    rerender(<ProgramCoursesPage />);

    expect(mockAddQueryParam).toHaveBeenCalledWith('/programs');
    expect(mockNavigate).toHaveBeenCalledWith('/programs?institution_id=inst-1');
  });

  test('skips RTK queries when institution id or programId is missing', () => {
    useParams.mockReturnValue({ programId: '' });
    useSelector.mockReturnValue(undefined);

    render(<ProgramCoursesPage />);

    expect(useGetProgramDetailQuery).toHaveBeenCalledWith(
      expect.anything(),
      { skip: true },
    );

    expect(useGetCoursesByProgramQuery).toHaveBeenCalledWith(
      expect.anything(),
      { skip: true },
    );
  });
});
