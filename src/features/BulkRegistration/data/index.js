import { validateCSVFile } from 'helpers';
import { BULK_REGISTRATION_STATES } from 'features/constants';
import { postBulkRegister } from 'features/BulkRegistration/data/api';

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
  const summary = data?.errors?.summary ?? {};
  const totalRows = Number(summary.total_rows || 0);
  const created = Number(summary.created || 0);
  const existed = Number(summary.existed || 0);
  const failed = Number(summary.failed || 0);

  if (failed > 0 && data?.errors.rows?.length) {
    return {
      type: BULK_REGISTRATION_STATES.ERROR_ROWS,
      failedRows: parseFailedRows(data.errors.rows),
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

  throw Object.assign(
    new Error(response?.data?.detail || 'Internal server error. Please contact support.'),
    {
      status: response?.status || 500,
      detail: response?.data?.detail || error?.message,
    },
  );
}

export async function uploadCSV(file) {
  try {
    await validateCSVFile(file);
    const { data } = await postBulkRegister(file);
    return parseRegistrationResult(data);
  } catch (error) {
    return handleUploadError(error);
  }
}
