import PropTypes from 'prop-types';
import { DataTable } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';

import SuccessPartial from 'features/BulkRegistration/BulkRegistrationPage/components/SuccessPartial';
import { ERROR_COLUMNS } from '../columns';

const ErrorRows = ({ data, onReset }) => (
  <div className="state-card state-card--error-rows">
    <h2 className="error-title">Error</h2>
    <p className="error-description">
      We detected errors in your data that prevent the registration from completing. Please review
      the list of failed rows below, correct the information in your CSV file, and try uploading
      it again.
    </p>

    <SuccessPartial data={data} onReset={onReset} disableUpload />

    <div className="failed-rows-header mt-3">
      <span className="failed-rows-header__badge">
        <span className="dot dot--red" />
        Failed Rows ({data.failedRows.length})
      </span>
      <Button type="button" className="btn btn--outline btn--sm" onClick={onReset}>
        <i className="fa-sharp fa-thin fa-file-spreadsheet" />
        Upload a new file
      </Button>
    </div>

    <DataTable columns={ERROR_COLUMNS} data={data.failedRows} itemCount={data?.failedRows?.length || 0} />
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

export default ErrorRows;
