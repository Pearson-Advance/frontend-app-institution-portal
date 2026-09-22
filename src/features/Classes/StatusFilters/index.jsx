import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@openedx/paragon';

import { updateFilters, updateCurrentPage } from 'features/Classes/data/slice';
import { CLASS_STATUS_TABS, initialPage } from 'features/constants';

import './index.scss';

const getHiddenValue = (statusFilter) => {
  if (statusFilter === CLASS_STATUS_TABS.VISIBLE) { return false; }
  if (statusFilter === CLASS_STATUS_TABS.HIDDEN) { return true; }
  return undefined;
};

const StatusFilters = ({ statusFilter, setStatusFilter }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.classes.filters);

  const statusList = Object.values(CLASS_STATUS_TABS);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Merge the visibility status into the existing class filters without
  // clobbering the other filter fields, and reset pagination to the first page.
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

    dispatch(updateFilters(newFilters));
    dispatch(updateCurrentPage(initialPage));
  }, [statusFilter, filters, dispatch]);

  // Remove the visibility filter when leaving the page so it does not persist.
  useEffect(() => () => {
    const { hidden, ...rest } = filtersRef.current;
    dispatch(updateFilters(rest));
  }, [dispatch]);

  return (
    <Tabs
      defaultActiveKey={CLASS_STATUS_TABS.VISIBLE}
      activeKey={statusFilter}
      onSelect={setStatusFilter}
      variant="button-group"
      className="mt-3 mb-2 status-filter-tabs"
    >
      {statusList.map((tab) => (
        <Tab key={tab} eventKey={tab} title={tab} />
      ))}
    </Tabs>
  );
};

StatusFilters.propTypes = {
  statusFilter: PropTypes.oneOf(Object.values(CLASS_STATUS_TABS)).isRequired,
  setStatusFilter: PropTypes.func.isRequired,
};

export default StatusFilters;
