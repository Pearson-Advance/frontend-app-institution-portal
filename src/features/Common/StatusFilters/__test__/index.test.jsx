/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { STATUS_TABS_VISIBILITY, initialPage } from 'features/constants';
import StatusFilters from 'features/Common/StatusFilters';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@openedx/paragon', () => ({
  Tabs: ({ children, activeKey, className }) => (
    <div data-testid="mock-tabs" data-active-key={activeKey} className={className}>
      {children}
    </div>
  ),
  Tab: ({ eventKey, title, onSelect }) => (
    <button
      type="button"
      data-testid={`tab-${eventKey}`}
      onClick={() => onSelect && onSelect(eventKey)}
    >
      {title}
    </button>
  ),
}));

describe('StatusFilters Component', () => {
  const mockDispatch = jest.fn();
  const mockSetStatusFilter = jest.fn();
  const mockUpdateFiltersAction = jest.fn((filters) => ({ type: 'UPDATE_FILTERS', payload: filters }));
  const mockUpdateCurrentPageAction = jest.fn((page) => ({ type: 'UPDATE_PAGE', payload: page }));

  const defaultProps = {
    statusFilter: STATUS_TABS_VISIBILITY.VISIBLE,
    setStatusFilter: mockSetStatusFilter,
    selectFilters: {},
    updateFiltersAction: mockUpdateFiltersAction,
    updateCurrentPageAction: mockUpdateCurrentPageAction,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  test('renders all visibility status tabs based on STATUS_TABS_VISIBILITY', () => {
    render(<StatusFilters {...defaultProps} />);

    Object.values(STATUS_TABS_VISIBILITY).forEach((tab) => {
      expect(screen.getByTestId(`tab-${tab}`)).toBeInTheDocument();
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  test('dispatches updateFiltersAction with hidden: false and resets page when statusFilter is VISIBLE and hidden is missing', () => {
    render(
      <StatusFilters
        {...defaultProps}
        statusFilter={STATUS_TABS_VISIBILITY.VISIBLE}
        selectFilters={{ search: 'math' }}
      />,
    );

    expect(mockUpdateFiltersAction).toHaveBeenCalledWith({
      search: 'math',
      hidden: false,
    });
    expect(mockUpdateCurrentPageAction).toHaveBeenCalledWith(initialPage);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  test('dispatches updateFiltersAction with hidden: true when statusFilter changes to HIDDEN', () => {
    const { rerender } = render(
      <StatusFilters
        {...defaultProps}
        statusFilter={STATUS_TABS_VISIBILITY.VISIBLE}
        selectFilters={{ hidden: false }}
      />,
    );

    jest.clearAllMocks();

    rerender(
      <StatusFilters
        {...defaultProps}
        statusFilter={STATUS_TABS_VISIBILITY.HIDDEN}
        selectFilters={{ hidden: false }}
      />,
    );

    expect(mockUpdateFiltersAction).toHaveBeenCalledWith({ hidden: true });
    expect(mockUpdateCurrentPageAction).toHaveBeenCalledWith(initialPage);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  test('removes hidden key from filters if statusFilter is neither VISIBLE nor HIDDEN', () => {
    const otherStatus = STATUS_TABS_VISIBILITY.ALL || 'All';

    render(
      <StatusFilters
        {...defaultProps}
        statusFilter={otherStatus}
        selectFilters={{ hidden: false, search: 'test' }}
      />,
    );

    expect(mockUpdateFiltersAction).toHaveBeenCalledWith({ search: 'test' });
    expect(mockUpdateCurrentPageAction).toHaveBeenCalledWith(initialPage);
  });

  test('does not dispatch if filters.hidden is already equal to desiredHidden', () => {
    render(
      <StatusFilters
        {...defaultProps}
        statusFilter={STATUS_TABS_VISIBILITY.VISIBLE}
        selectFilters={{ hidden: false }}
      />,
    );

    expect(mockUpdateFiltersAction).not.toHaveBeenCalled();
    expect(mockUpdateCurrentPageAction).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test('does not dispatch updateCurrentPageAction if it is not provided', () => {
    render(
      <StatusFilters
        {...defaultProps}
        updateCurrentPageAction={undefined}
        statusFilter={STATUS_TABS_VISIBILITY.HIDDEN}
        selectFilters={{}}
      />,
    );

    expect(mockUpdateFiltersAction).toHaveBeenCalledWith({ hidden: true });
    expect(mockUpdateCurrentPageAction).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test('cleans up hidden filter on unmount without losing other filters', () => {
    const { unmount } = render(
      <StatusFilters
        {...defaultProps}
        statusFilter={STATUS_TABS_VISIBILITY.VISIBLE}
        selectFilters={{ hidden: false, otherFilter: 'value' }}
      />,
    );

    jest.clearAllMocks();

    unmount();

    expect(mockUpdateFiltersAction).toHaveBeenCalledWith({ otherFilter: 'value' });
    expect(mockDispatch).toHaveBeenCalledWith(mockUpdateFiltersAction({ otherFilter: 'value' }));
  });

  test('applies default CSS classes when classnames prop is omitted', () => {
    render(<StatusFilters {...defaultProps} />);

    const tabsContainer = screen.getByTestId('mock-tabs');
    expect(tabsContainer).toHaveClass('status-filter-tabs mt-3 mb-2');
  });

  test('applies custom classnames when provided', () => {
    render(<StatusFilters {...defaultProps} classnames="custom-tabs-class" />);

    const tabsContainer = screen.getByTestId('mock-tabs');
    expect(tabsContainer).toHaveClass('status-filter-tabs custom-tabs-class');
    expect(tabsContainer).not.toHaveClass('mt-3 mb-2');
  });

  test('handles null or undefined selectFilters gracefully', () => {
    expect(() => {
      render(
        <StatusFilters
          {...defaultProps}
          selectFilters={null}
        />,
      );
    }).not.toThrow();

    expect(mockUpdateFiltersAction).toHaveBeenCalledWith({ hidden: false });
  });
});
