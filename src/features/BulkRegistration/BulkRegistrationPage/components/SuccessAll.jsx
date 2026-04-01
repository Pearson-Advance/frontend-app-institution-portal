import PropTypes from 'prop-types';
import { Button } from 'react-paragon-topaz';

const SuccessAll = ({ data, onReset }) => (
  <div className="state-card state-card--success">
    <div className="success-banner">
      <span className="success-banner__icon">✓</span>
      <div>
        <p className="success-banner__title">All registrations successful!</p>
        <p className="success-banner__subtitle">
          We&apos;ve successfully registered all {data.totalRegistered} {data.totalRegistered > 1 ? 'students' : 'student'} from your uploaded file.
        </p>
      </div>
    </div>
    <div className="state-actions">
      <Button type="button" className="btn btn--outline" onClick={onReset}>
        <i className="fa-sharp fa-thin fa-file-spreadsheet" />
        Upload another file
      </Button>
    </div>
  </div>
);

SuccessAll.propTypes = {
  data: PropTypes.shape({
    totalRegistered: PropTypes.number.isRequired,
  }).isRequired,
  onReset: PropTypes.func.isRequired,
};

export default SuccessAll;
