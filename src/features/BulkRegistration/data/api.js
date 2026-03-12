import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

import { BULK_REGISTRATION_STATES } from 'features/constants';

export async function uploadCSV(file) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  const formData = new FormData();
  formData.append('csv_file', file);

  try {
    const response = await getAuthenticatedHttpClient().post(
      `${apiV2BaseUrl}/bulk-user-register/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    const { data } = response;

    const totalRows = Number(data.summary?.total_rows || 0);
    const created = Number(data.summary?.created || 0);
    const existed = Number(data.summary?.existed || 0);
    const failed = Number(data.summary?.failed || 0);

    if (failed > 0 && data.rows?.length) {
      return {
        type: BULK_REGISTRATION_STATES.ERROR_ROWS,
        failedRows: data.rows.map((row) => ({
          row: Number(row.row_number),
          email: row.email || '-',
          status: row.status,
          message: Object.entries(row.errors || {})
            .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
            .join(' | '),
        })),
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
  } catch (error) {
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
          failedRows: csvError.rows.map((row) => ({
            row: Number(row.row_number),
            email: row.email || '-',
            status: row.status,
            message: Object.entries(row.errors || {})
              .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
              .join(' | '),
          })),
        };
      }
    }

    throw Object.assign(
      new Error(response?.data?.detail || 'Internal server error. Please contact support.'),
      {
        status: response?.status || 500,
        detail: response?.data?.detail,
      },
    );
  }
}
