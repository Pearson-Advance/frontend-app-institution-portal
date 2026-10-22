/* eslint-disable react/prop-types, func-names */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';

import ProgramDetailPage from 'features/Programs/ProgramDetailPage';

import * as programsApiModule from 'features/Programs/data/programsApi';
import * as sessionsApiModule from 'features/Sessions/data/sessionsApi';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ programId: 'program-v1%3A101' }),
  useNavigate: () => mockNavigate,
}));

jest.mock('hooks', () => ({
  useInstitutionIdQueryParam: () => jest.fn((path) => `${path}?institution_id=1`),
}));

jest.mock('features/Main/LinkWithQuery', () => function ({ to, children, className }) {
  return (
    <a href={to} className={className} data-testid="link-with-query">
      {children}
    </a>
  );
});

jest.mock('features/Sessions/AddSessionModal', () => function ({ isOpen, onClose, programInfo }) {
  return isOpen ? (
    <div data-testid="add-session-modal">
      <span>Modal Open for {programInfo?.programId}</span>
      <button onClick={onClose} type="button">Close Modal</button>
    </div>
  ) : null;
});

jest.mock('features/Programs/ProgramDetailTable', () => function ({ isLoading, count }) {
  return (
    <div data-testid="program-detail-table">
      {isLoading ? <span>Loading Table...</span> : <span>Table Loaded with {count} items</span>}
    </div>
  );
});

describe('ProgramDetailPage Component', () => {
  const mockProgramData = {
    programTitle: 'Master in Computer Science',
    numberOfStudents: 45,
    totalSessions: 3,
  };

  const mockSessionsData = {
    results: [
      { sessionId: 's1', sessionName: 'Cohort 1' },
      { sessionId: 's2', sessionName: 'Cohort 2' },
    ],
    count: 2,
    numPages: 2,
  };

  const preloadedState = {
    main: {
      selectedInstitution: { id: 1, name: 'Institution 1' },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(programsApiModule, 'useGetProgramDetailQuery').mockReturnValue({
      data: mockProgramData,
      isLoading: false,
    });

    jest.spyOn(sessionsApiModule, 'useGetSessionsByOfferingQuery').mockReturnValue({
      data: mockSessionsData,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders program details header, cards, and action buttons', () => {
    renderWithProviders(<ProgramDetailPage />, { preloadedState });

    expect(screen.getByText('Program: Master in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Students enrolled')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add session/i })).toBeInTheDocument();
    expect(screen.getByText('View courses')).toBeInTheDocument();
  });

  it('renders table and pagination when numPages is greater than 1', () => {
    renderWithProviders(<ProgramDetailPage />, { preloadedState });

    expect(screen.getByTestId('program-detail-table')).toBeInTheDocument();
    expect(screen.getByText('Table Loaded with 2 items')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /paginationnavigation/i })).toBeInTheDocument();
  });

  it('opens and closes the AddSessionModal', () => {
    renderWithProviders(<ProgramDetailPage />, { preloadedState });

    expect(screen.queryByTestId('add-session-modal')).not.toBeInTheDocument();

    const addSessionButton = screen.getByRole('button', { name: /add session/i });
    fireEvent.click(addSessionButton);

    expect(screen.getByTestId('add-session-modal')).toBeInTheDocument();

    const closeModalButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeModalButton);

    expect(screen.queryByTestId('add-session-modal')).not.toBeInTheDocument();
  });
});
