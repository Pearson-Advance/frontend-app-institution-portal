/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useGetSessionsListQuery } from 'features/Sessions/data/sessionsApi';
import { updateCurrentPage, updateFilters } from 'features/Sessions/data/slice';
import { STATUS_TABS_VISIBILITY } from 'features/constants';
import { useInstitutionIdQueryParam } from 'hooks';

import SessionsPage from 'features/Sessions/SessionsPage';

const mockHiddenStatus = 'Hidden';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('hooks', () => ({
  useInstitutionIdQueryParam: jest.fn(),
}));

jest.mock('features/Sessions/data/sessionsApi', () => ({
  useGetSessionsListQuery: jest.fn(),
}));

jest.mock('features/Sessions/data/slice', () => ({
  updateCurrentPage: jest.fn((page) => ({ type: 'sessions/updateCurrentPage', payload: page })),
  updateFilters: jest.fn((filters) => ({ type: 'sessions/updateFilters', payload: filters })),
}));

jest.mock('features/Common/StatusFilters', () => function MockStatusFilters({
  statusFilter,
  setStatusFilter,
  selectFilters,
  updateFiltersAction,
  updateCurrentPageAction,
  classnames,
}) {
  return (
    <div data-testid="mock-status-filters" className={classnames}>
      <span data-testid="current-status-filter">{statusFilter}</span>
      <span data-testid="applied-filters">{JSON.stringify(selectFilters)}</span>
      <button
        type="button"
        data-testid="btn-change-status"
        onClick={() => setStatusFilter(mockHiddenStatus)}
      >
        Set Hidden
      </button>
      <button
        type="button"
        data-testid="btn-trigger-filter-action"
        onClick={() => updateFiltersAction({ hidden: true })}
      >
        Trigger Filter Action
      </button>
      <button
        type="button"
        data-testid="btn-trigger-page-action"
        onClick={() => updateCurrentPageAction(1)}
      >
        Trigger Page Action
      </button>
    </div>
  );
});

jest.mock('features/Sessions/SessionsTable', () => function MockSessionsTable({
  isLoading,
  count,
  data,
}) {
  return (
    <div data-testid="mock-sessions-table">
      <span data-testid="table-loading">{String(isLoading)}</span>
      <span data-testid="table-count">{count}</span>
      <span data-testid="table-items-count">{data.length}</span>
    </div>
  );
});

describe('SessionsPage Component', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockAddQueryParam = jest.fn((path) => `${path}?institutionId=inst-1`);

  const mockSessionsData = {
    count: 25,
    numPages: 3,
    results: [
      { sessionId: 'session-1', sessionName: 'Spring 2026' },
      { sessionId: 'session-2', sessionName: 'Summer 2026' },
    ],
  };

  const setupReduxMock = (institutionId = 'inst-1', currentPage = 1, filters = { hidden: false }) => {
    useSelector.mockImplementation((selector) => {
      const state = {
        sessions: {
          currentPage,
          filters,
        },
        main: {
          selectedInstitution: institutionId ? { id: institutionId } : undefined,
        },
      };
      return selector(state);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    useInstitutionIdQueryParam.mockReturnValue(mockAddQueryParam);

    setupReduxMock();

    useGetSessionsListQuery.mockReturnValue({
      data: mockSessionsData,
      isLoading: false,
    });
  });

  test('renders title, status filters, and table with data', () => {
    render(<SessionsPage />);

    expect(screen.getByRole('heading', { name: /^sessions$/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-status-filters')).toBeInTheDocument();
    expect(screen.getByTestId('mock-status-filters')).toHaveClass('mb-3');
    expect(screen.getByTestId('current-status-filter')).toHaveTextContent(STATUS_TABS_VISIBILITY.VISIBLE);
    expect(screen.getByTestId('mock-sessions-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('table-count')).toHaveTextContent('25');
    expect(screen.getByTestId('table-items-count')).toHaveTextContent('2');
  });

  test('renders pagination when numPages > 1 and handles page selection', () => {
    render(<SessionsPage />);

    const paginationNav = screen.getByLabelText('paginationNavigation');
    expect(paginationNav).toBeInTheDocument();

    const nextPageButton = screen.getByRole('button', { name: /next, page 2/i });
    fireEvent.click(nextPageButton);

    expect(updateCurrentPage).toHaveBeenCalledWith(2);
    expect(mockDispatch).toHaveBeenCalledWith(updateCurrentPage(2));
  });

  test('does not render pagination when numPages <= 1', () => {
    useGetSessionsListQuery.mockReturnValue({
      data: {
        count: 2,
        numPages: 1,
        results: mockSessionsData.results,
      },
      isLoading: false,
    });

    render(<SessionsPage />);

    expect(screen.queryByLabelText('paginationNavigation')).not.toBeInTheDocument();
  });

  test('passes Redux filters and action handlers to StatusFilters and updates internal statusFilter state', () => {
    render(<SessionsPage />);

    expect(screen.getByTestId('applied-filters')).toHaveTextContent(JSON.stringify({ hidden: false }));

    const changeStatusBtn = screen.getByTestId('btn-change-status');
    fireEvent.click(changeStatusBtn);
    expect(screen.getByTestId('current-status-filter')).toHaveTextContent(STATUS_TABS_VISIBILITY.HIDDEN);

    fireEvent.click(screen.getByTestId('btn-trigger-filter-action'));
    expect(updateFilters).toHaveBeenCalledWith({ hidden: true });

    fireEvent.click(screen.getByTestId('btn-trigger-page-action'));
    expect(updateCurrentPage).toHaveBeenCalledWith(1);
  });

  test('redirects to /programs when selected institution changes', () => {
    const { rerender } = render(<SessionsPage />);

    expect(mockNavigate).not.toHaveBeenCalled();

    setupReduxMock('inst-2');
    rerender(<SessionsPage />);

    expect(mockAddQueryParam).toHaveBeenCalledWith('/programs');
    expect(mockNavigate).toHaveBeenCalledWith('/programs?institutionId=inst-1');
  });

  test('falls back to default response values when query data is undefined', () => {
    useGetSessionsListQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<SessionsPage />);

    expect(screen.getByTestId('table-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('table-count')).toHaveTextContent('0');
    expect(screen.getByTestId('table-items-count')).toHaveTextContent('0');
    expect(screen.queryByLabelText('paginationNavigation')).not.toBeInTheDocument();
  });
});
