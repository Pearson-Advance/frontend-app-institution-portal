import PropTypes from 'prop-types';
import { DataTable } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';

import { ERROR_COLUMNS } from '../columns';

export const SuccessAll = ({ data, onReset }) => (
  <div className="state-card state-card--success">
    <div className="success-banner">
      <span className="success-banner__icon">✓</span>
      <div>
        <p className="success-banner__title">All registrations successful!</p>
        <p className="success-banner__subtitle">
          We&apos;ve successfully registered all {data.totalRegistered} students from your uploaded file.
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

export const SuccessPartial = ({ data, onReset }) => (
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
    </div>
    <div className="state-actions">
      <Button type="button" className="btn btn--outline" onClick={onReset}>
        Upload a new file
      </Button>
    </div>
  </div>
);

SuccessPartial.propTypes = {
  data: PropTypes.shape({
    totalRows: PropTypes.number.isRequired,
    alreadyExisted: PropTypes.number.isRequired,
    createdSuccessfully: PropTypes.number.isRequired,
  }).isRequired,
  onReset: PropTypes.func.isRequired,
};

export const ErrorRows = ({ data, onReset }) => (
  <div className="state-card state-card--error-rows">
    <h2 className="error-title">Error</h2>
    <p className="error-description">
      We detected errors in your data that prevent the registration from completing. Please review
      the list of failed rows below, correct the information in your CSV file, and try uploading
      it again.
    </p>

    <div className="failed-rows-header">
      <span className="failed-rows-header__badge">
        <span className="dot dot--red" />
        Failed Rows ({data.failedRows.length})
      </span>
      <Button type="button" className="btn btn--outline btn--sm" onClick={onReset}>
        <i className="fa-sharp fa-thin fa-file-spreadsheet" />
        Upload Another
      </Button>
    </div>

    <DataTable columns={ERROR_COLUMNS} data={data.failedRows} />
  </div>
);

ErrorRows.propTypes = {
  data: PropTypes.shape({
    failedRows: PropTypes.arrayOf(
      PropTypes.shape({
        row: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onReset: PropTypes.func.isRequired,
};

export const FatalError = ({ error, onReset }) => (
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

export const LoadingScreen = () => (
  <div className="state-card state-card--loading">
    <div className="spinner" />
    <p className="state-card__title">Processing your file...</p>
    <p className="state-card__subtitle">This may take a moment</p>
  </div>
);
