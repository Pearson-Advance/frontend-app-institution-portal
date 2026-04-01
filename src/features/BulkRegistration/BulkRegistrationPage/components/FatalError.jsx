import PropTypes from 'prop-types';
import { Button } from 'react-paragon-topaz';

const FatalError = ({ error, onReset }) => (
  <div className="state-card state-card--fatal">
    <h2 className="fatal-title">Error</h2>
    <p className="fatal-message">Something went wrong processing this file</p>
    <p className="fatal-detail">{error?.detail || 'Unexpected server error.'}</p>
    <div className="state-actions">
      <Button type="button" className="btn btn--outline" onClick={onReset}>
        Try again with another file
      </Button>
    </div>
  </div>
);

FatalError.propTypes = {
  error: PropTypes.shape({
    detail: PropTypes.string,
  }),
  onReset: PropTypes.func.isRequired,
};

FatalError.defaultProps = {
  error: null,
};

export default FatalError;
