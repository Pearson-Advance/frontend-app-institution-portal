import PropTypes from 'prop-types';
import { Button } from 'react-paragon-topaz';

const SuccessPartial = ({ data, onReset, disableUpload }) => (
  <div className="state-card">
    <h2 className="summary-title">Summary</h2>
    <div className="stats-grid">
      <div className="stat-card stat-card--neutral">
        <span className="stat-card__label">Total rows</span>
        <span className="stat-card__value">{data.totalRows}</span>
      </div>
      <div className="stat-card stat-card--warning">
        <span className="stat-card__label">Already existed</span>
        <span className="stat-card__value">{data.alreadyExisted}</span>
      </div>
      <div className="stat-card stat-card--success">
        <span className="stat-card__label">Created Successfully</span>
        <span className="stat-card__value">{data.createdSuccessfully}</span>
      </div>
      {data.failedRowsCount > 0 && (
        <div className="stat-card stat-card--error">
          <span className="stat-card__label">Failed</span>
          <span className="stat-card__value">{data.failedRowsCount}</span>
        </div>
      )}
    </div>
    {!disableUpload && (
      <div className="state-actions">
        <Button type="button" className="btn btn--outline" onClick={onReset}>
          <i className="fa-sharp fa-thin fa-file-spreadsheet" />
          Upload a new file
        </Button>
      </div>
    )}
  </div>
);

SuccessPartial.propTypes = {
  data: PropTypes.shape({
    totalRows: PropTypes.number.isRequired || PropTypes.string.isRequired,
    alreadyExisted: PropTypes.number.isRequired,
    createdSuccessfully: PropTypes.number.isRequired,
    failedRowsCount: PropTypes.number,
  }).isRequired,
  onReset: PropTypes.func.isRequired,
  disableUpload: PropTypes.bool,
};

SuccessPartial.defaultProps = {
  disableUpload: false,
};

export default SuccessPartial;
