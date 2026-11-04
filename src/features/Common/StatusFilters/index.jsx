import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@openedx/paragon';

import { STATUS_TABS_VISIBILITY, initialPage } from 'features/constants';

import './index.scss';

const getHiddenValue = (statusFilter) => {
  if (statusFilter === STATUS_TABS_VISIBILITY.VISIBLE) { return false; }
  if (statusFilter === STATUS_TABS_VISIBILITY.HIDDEN) { return true; }
  return undefined;
};

const StatusFilters = ({
  statusFilter,
  setStatusFilter,
  selectFilters,
  updateFiltersAction,
  updateCurrentPageAction,
  classnames,
}) => {
  const dispatch = useDispatch();
  const filters = useMemo(() => selectFilters || {}, [selectFilters]);

  const statusList = useMemo(() => Object.values(STATUS_TABS_VISIBILITY), []);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    const desiredHidden = getHiddenValue(statusFilter);
    const hasHiddenKey = Object.prototype.hasOwnProperty.call(filters, 'hidden');

    const needsUpdate = desiredHidden === undefined
      ? hasHiddenKey
      : filters.hidden !== desiredHidden;

    if (!needsUpdate) { return; }

    const newFilters = { ...filters };

    if (desiredHidden === undefined) {
      delete newFilters.hidden;
    } else {
      newFilters.hidden = desiredHidden;
    }

    dispatch(updateFiltersAction(newFilters));
    if (updateCurrentPageAction) {
      dispatch(updateCurrentPageAction(initialPage));
    }
  }, [statusFilter, filters, dispatch, updateFiltersAction, updateCurrentPageAction]);

  useEffect(() => () => {
    const { hidden, ...rest } = filtersRef.current || {};
    dispatch(updateFiltersAction(rest));
  }, [dispatch, updateFiltersAction]);

  return (
    <Tabs
      defaultActiveKey={STATUS_TABS_VISIBILITY.VISIBLE}
      activeKey={statusFilter}
      onSelect={setStatusFilter}
      variant="button-group"
      className={`status-filter-tabs ${classnames || 'mt-3 mb-2'}`}
    >
      {statusList.map((tab) => (
        <Tab key={tab} eventKey={tab} title={tab} />
      ))}
    </Tabs>
  );
};

StatusFilters.propTypes = {
  statusFilter: PropTypes.oneOf(Object.values(STATUS_TABS_VISIBILITY)).isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  selectFilters: PropTypes.shape({}),
  updateFiltersAction: PropTypes.func.isRequired,
  updateCurrentPageAction: PropTypes.func,
  classnames: PropTypes.string,
};

StatusFilters.defaultProps = {
  selectFilters: {},
  updateCurrentPageAction: undefined,
  classnames: '',
};

export default StatusFilters;
