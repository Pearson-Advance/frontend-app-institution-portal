import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
  const map = {
    FAILED_VALIDATION: 'badge--error',
    'Processing failed': 'badge--warning',
  };

  return <span className={`status-badge ${map[status] || 'badge--error'}`}>{status}</span>;
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
