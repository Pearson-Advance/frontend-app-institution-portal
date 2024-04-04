import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { updateActiveTab } from 'features/Main/data/slice';

const ActiveTabUpdater = ({ children, path }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const currentTab = path?.split('/')[1] || 'dashboard';
    dispatch(updateActiveTab(currentTab));
  }, [dispatch, path]);

  return children;
};

ActiveTabUpdater.propTypes = {
  path: PropTypes.string.isRequired,
};

export default ActiveTabUpdater;
