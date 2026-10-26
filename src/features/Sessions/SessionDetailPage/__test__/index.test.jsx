/* eslint-disable react/prop-types */
import React from 'react';
import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useGetSessionDetailQuery } from 'features/Sessions/data/sessionsApi';
import { useInstitutionIdQueryParam } from 'hooks';

import SessionDetailPage from 'features/Sessions/SessionDetailPage';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('hooks', () => ({
  useInstitutionIdQueryParam: jest.fn(),
}));

jest.mock('helpers', () => ({
  formatUTCDate: jest.fn((date) => `formatted-${date}`),
}));

jest.mock('features/Sessions/data/sessionsApi', () => ({
  useGetSessionDetailQuery: jest.fn(),
}));

jest.mock('features/Main/LinkWithQuery', () => function MockLink({ to, children, className }) {
  return <a href={to} className={className} data-testid="back-link">{children}</a>;
});

jest.mock('features/Sessions/AddSessionModal', () => function MockAddSessionModal({
  isOpen, onClose, sessionData, isEditing,
}) {
  return isOpen ? (
    <div data-testid="edit-session-modal">
      <span>Edit Modal Active (isEditing: {String(isEditing)})</span>
      <span data-testid="modal-session-name">{sessionData.sessionName}</span>
      <button onClick={onClose} type="button">Close Edit Modal</button>
    </div>
  ) : null;
});

jest.mock('features/Sessions/EnrollStudentModal', () => function MockEnrollStudentModal({
  isOpen, onClose, sessionId, sessionName,
}) {
  return isOpen ? (
    <div data-testid="enroll-student-modal">
      <span>Enroll Modal Active</span>
      <span>Session ID: {sessionId}</span>
      <span>Session Name: {sessionName}</span>
      <button onClick={onClose} type="button">Close Enroll Modal</button>
    </div>
  ) : null;
});

jest.mock('features/Sessions/SessionDetailTable', () => function MockSessionDetailTable({ data, count, isLoading }) {
  return (
    <div data-testid="session-detail-table">
      <span data-testid="table-loading">{String(isLoading)}</span>
      <span data-testid="table-count">{count}</span>
      <span data-testid="table-items-length">{data.length}</span>
    </div>
  );
});

describe('SessionDetailPage Component', () => {
  const mockNavigate = jest.fn();
  const mockAddQueryParam = jest.fn((path) => `${path}?institutionId=inst-1`);

  const mockSessionData = {
    sessionId: 'session-2026',
    sessionName: 'Spring 2026 Cohort',
    programTitle: 'Fullstack Certificate',
    numberOfStudents: 25,
    totalClasses: 2,
    classes: [
      { classId: 'cls-1', className: 'Frontend 101' },
      { classId: 'cls-2', className: 'Backend 101' },
    ],
    startDate: '2026-03-01T00:00:00Z',
    endDate: '2026-06-30T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ sessionId: encodeURIComponent('session-2026') });
    useInstitutionIdQueryParam.mockReturnValue(mockAddQueryParam);
    useSelector.mockReturnValue({ id: 'inst-1' });

    useGetSessionDetailQuery.mockReturnValue({
      data: mockSessionData,
      isLoading: false,
    });
  });

  it('renders session header, dates and stats cards correctly', () => {
    const { container } = render(<SessionDetailPage />);

    expect(screen.getByText('Session: Spring 2026 Cohort')).toBeInTheDocument();
    expect(screen.getByText('Program: Fullstack Certificate')).toBeInTheDocument();
    expect(screen.getByText('Start Date: formatted-2026-03-01T00:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('End Date: formatted-2026-06-30T00:00:00Z')).toBeInTheDocument();

    const cardValues = container.querySelectorAll('.card-container .value');
    expect(cardValues[0]).toHaveTextContent('25');
    expect(cardValues[1]).toHaveTextContent('2');

    expect(screen.getByTestId('back-link')).toHaveAttribute('href', '/programs');
  });

  it('omits start and end date labels if they are null', () => {
    useGetSessionDetailQuery.mockReturnValue({
      data: {
        ...mockSessionData,
        startDate: null,
        endDate: null,
      },
      isLoading: false,
    });

    render(<SessionDetailPage />);

    expect(screen.queryByText(/Start Date:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/End Date:/i)).not.toBeInTheDocument();
  });

  it('passes data and loading state down to SessionDetailTable', () => {
    useGetSessionDetailQuery.mockReturnValue({
      data: mockSessionData,
      isLoading: true,
    });

    render(<SessionDetailPage />);

    expect(screen.getByTestId('session-detail-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('table-count')).toHaveTextContent('2');
    expect(screen.getByTestId('table-items-length')).toHaveTextContent('2');
  });

  it('handles opening and closing the Enroll Student modal', () => {
    render(<SessionDetailPage />);

    const enrollBtn = screen.getByRole('button', { name: /enroll student/i });
    expect(screen.queryByTestId('enroll-student-modal')).not.toBeInTheDocument();

    fireEvent.click(enrollBtn);
    expect(screen.getByTestId('enroll-student-modal')).toBeInTheDocument();
    expect(screen.getByText('Session ID: session-2026')).toBeInTheDocument();
    expect(screen.getByText('Session Name: Spring 2026 Cohort')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close enroll modal/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('enroll-student-modal')).not.toBeInTheDocument();
  });

  it('handles opening and closing the Edit Session modal', () => {
    render(<SessionDetailPage />);

    const editBtn = screen.getByRole('button', { name: /edit session/i });
    expect(screen.queryByTestId('edit-session-modal')).not.toBeInTheDocument();

    fireEvent.click(editBtn);

    const editModal = screen.getByTestId('edit-session-modal');
    expect(editModal).toBeInTheDocument();
    expect(within(editModal).getByTestId('modal-session-name')).toHaveTextContent('Spring 2026 Cohort');

    const closeBtn = screen.getByRole('button', { name: /close edit modal/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('edit-session-modal')).not.toBeInTheDocument();
  });

  it('redirects to /programs when selected institution changes', () => {
    const { rerender } = render(<SessionDetailPage />);

    expect(mockNavigate).not.toHaveBeenCalled();

    useSelector.mockReturnValue({ id: 'inst-2' });
    rerender(<SessionDetailPage />);

    expect(mockAddQueryParam).toHaveBeenCalledWith('/programs');
    expect(mockNavigate).toHaveBeenCalledWith('/programs?institutionId=inst-1');
  });
});
