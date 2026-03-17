import { validateCSVFile } from 'helpers';
import { BULK_REGISTRATION_STATES } from 'features/constants';
import { postBulkRegister } from 'features/BulkRegistration/data/api';

function parseFailedRows(rows) {
  return rows.map((row) => ({
    row: Number(row.row_number) - 1,
    email: row.email || '-',
    status: row.status,
    message: Object.entries(row.errors || {})
      .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
      .join(' | '),
  }));
}

function parseRegistrationResult(data) {
  const summary = data?.errors?.summary ?? {};
  const totalRows = Number(summary.total_rows || 0);
  const created = Number(summary.created || 0);
  const existed = Number(summary.existed || 0);
  const failed = Number(summary.failed || 0);

  if (failed > 0 && data.rows?.length) {
    return {
      type: BULK_REGISTRATION_STATES.ERROR_ROWS,
      failedRows: parseFailedRows(data.rows),
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
