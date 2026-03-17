import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
  const map = {
    'Validation failed': 'badge--error',
    'Processing failed': 'badge--warning',
  };

  return <span className={`status-badge ${map[status] || 'badge--error'}`}>{status}</span>;
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
