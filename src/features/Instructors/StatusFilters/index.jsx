import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@openedx/paragon';

import { fetchInstructorsData } from 'features/Instructors/data/thunks';
import { updateFilters, resetInstructorsRequest } from 'features/Instructors/data/slice';
import { INSTRUCTOR_STATUS_TABS } from 'features/constants';

import './index.scss';

const StatusFilters = ({ currentPage, statusFilter, setStatusFilter }) => {
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const filters = useSelector((state) => state.instructors.filters);
  const dispatch = useDispatch();

  const statusList = Object.values(INSTRUCTOR_STATUS_TABS);

  useEffect(() => {
    if (selectedInstitution?.id) {
      const newFilters = { ...filters };

      if (statusFilter === INSTRUCTOR_STATUS_TABS.ACTIVE) {
        newFilters.active = true;
      } else if (statusFilter === INSTRUCTOR_STATUS_TABS.INACTIVE) {
        newFilters.active = false;
      } else { delete newFilters.active; }

      dispatch(updateFilters(newFilters));
      dispatch(fetchInstructorsData(selectedInstitution?.id, currentPage, newFilters));
    }

    return () => {
      dispatch(resetInstructorsRequest());
      dispatch(updateFilters({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInstitution?.id, currentPage, statusFilter, dispatch]);

  return (
    <Tabs
      defaultActiveKey="All"
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
  currentPage: PropTypes.number.isRequired,
  statusFilter: PropTypes.oneOf(Object.values(INSTRUCTOR_STATUS_TABS)).isRequired,
  setStatusFilter: PropTypes.func.isRequired,
};

export default StatusFilters;
