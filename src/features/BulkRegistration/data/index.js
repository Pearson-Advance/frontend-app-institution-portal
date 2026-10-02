import { validateCSVFile } from 'helpers';
import {
  BULK_REGISTRATION_STATES,
  BULK_REGISTRATION_REQUIRED_COLUMNS_INSTRUCTORS,
  BULK_REGISTRATION_REQUIRED_COLUMNS_STUDENTS,
} from 'features/constants';
import { postBulkRegisterStudents, postBulkRegisterInstructors } from 'features/BulkRegistration/data/api';

function parseFailedRows(rows) {
  return rows.map((row) => {
    let message = '-';

    if (Array.isArray(row.errors)) {
      message = row.errors.length ? `Please click here and share the details below with support for further assistance:  ${row.errors.join(', ')}` : '-';
    } else if (row.errors && typeof row.errors === 'object') {
      message = Object.entries(row.errors)
        .map(([field, msgs]) => `${field}: ${msgs?.join(', ')}`)
        .join(' | ');
    }

    return {
      row: row.row_number,
      email: row.email || '-',
      status: row.status,
      message,
    };
  });
}

function parseRegistrationResult(data) {
  const summary = data?.summary ?? data?.errors?.summary ?? {};
  const rows = data?.rows ?? data?.errors?.rows ?? [];

  const totalRows = Number(summary.total_rows || 0);
  const created = Number(summary.created || 0);
  const existed = Number(summary.existed || 0);
  const failed = Number(summary.failed || 0);

  if (failed > 0 && rows.length > 0) {
    return {
      type: BULK_REGISTRATION_STATES.ERROR_ROWS,
      failedRows: parseFailedRows(rows),
      totalRows,
      alreadyExisted: existed,
      createdSuccessfully: created,
      failedRowsCount: failed,
    };
  }

  if (existed > 0) {
    return {
      type: BULK_REGISTRATION_STATES.SUCCESS_PARTIAL,
      totalRows,
      alreadyExisted: existed,
      createdSuccessfully: created,
    };
  }

  return {
    type: BULK_REGISTRATION_STATES.SUCCESS_ALL,
    totalRegistered: created || totalRows,
  };
}

function handleUploadError(error) {
  const { response } = error;

  if (response?.status === 400) {
    const csvError = response.data?.csv_file;

    if (Array.isArray(csvError)) {
      throw Object.assign(new Error(csvError.join(' ')), {
        status: 400,
        detail: csvError.join(' '),
      });
    }

    if (csvError?.detail && csvError?.rows) {
      return {
        type: BULK_REGISTRATION_STATES.ERROR_ROWS,
        failedRows: parseFailedRows(csvError.rows),
        totalRows: Number(csvError?.summary?.total_rows || 0),
        alreadyExisted: Number(csvError?.summary?.existed || 0),
        createdSuccessfully: Number(csvError?.summary?.created || 0),
        failedRowsCount: Number(csvError?.summary?.failed || 0),
      };
    }
  }

  const errorMessage = response?.data?.detail
    || error?.detail
    || error?.message
    || 'Internal server error. Please contact support.';

  const errorStatus = response?.status || error?.status || 500;

  throw Object.assign(
    new Error(errorMessage),
    {
      status: errorStatus,
      detail: errorMessage,
    },
  );
}

/**
 * Returns the list of required CSV header columns based on the registration target.
 *
 * @param {boolean} [isInstructor=false] - Indicates whether the request is for instructors.
 * @returns {string[]} An array of required column names.
 */
export const getRequiredColumns = (isInstructor = false) => (
  isInstructor
    ? BULK_REGISTRATION_REQUIRED_COLUMNS_INSTRUCTORS
    : BULK_REGISTRATION_REQUIRED_COLUMNS_STUDENTS
);

/**
 * Resolves the appropriate bulk registration API endpoint function based on the entity type.
 *
 * @param {boolean} [isInstructor=false] - Indicates whether to retrieve the instructor API handler.
 * @returns {Function} The API function responsible for executing the HTTP request.
 */
export const getBulkRegisterApi = (isInstructor = false) => (
  isInstructor ? postBulkRegisterInstructors : postBulkRegisterStudents
);

/**
 * Orchestrates the bulk user registration workflow by validating the file,
 * executing the API call, parsing the result, and handling potential errors.
 *
 * @async
 * @param {File} file - The uploaded CSV file object.
 * @param {boolean} [isInstructor=false] - Indicates whether the upload is for instructors.
 * @returns {Promise<Object>} The parsed result object or formatted error state.
 */
export const processBulkRegistration = async (file, isInstructor = false, institutionId = null) => {
  try {
    const requiredColumns = getRequiredColumns(isInstructor);

    await validateCSVFile(file, requiredColumns);

    const apiCall = getBulkRegisterApi(isInstructor);
    const { data } = await apiCall(file, institutionId);

    return parseRegistrationResult(data);
  } catch (error) {
    return handleUploadError(error);
  }
};
