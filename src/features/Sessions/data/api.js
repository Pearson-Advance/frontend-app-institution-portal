import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { MAX_TABLE_RECORDS } from 'features/constants';

function getAllSessions(institutionId, page = 1, params = {}) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offering-runs/`,
    {
      params: {
        institution_id: institutionId,
        page,
        limit: true,
        page_size: MAX_TABLE_RECORDS,
        ...params,
      },
    },
  );
}

function getSessionsByOffering(institutionId, offeringId, page = 1, params = {}) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offering-runs/`,
    {
      params: {
        institution_id: institutionId,
        offering_id: offeringId,
        page,
        limit: true,
        page_size: MAX_TABLE_RECORDS,
        ...params,
      },
    },
  );
}

function getSessionDetail(institutionId, sessionId, params = {}) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().get(
    `${apiV2BaseUrl}/offering-runs/${sessionId}/`,
    {
      params: {
        institution_id: institutionId,
        ...params,
      },
    },
  );
}

/**
 * Creates a new session (offering run).
 */
function handleNewSession(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/offering-runs/`,
    data,
  );
}

/**
 * Updates an existing session (e.g. toggling hidden visibility).
 */
function handleEditSession(data, params = {}) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().patch(
    `${apiV2BaseUrl}/offering-runs/`,
    data,
    { params },
  );
}

/**
 * Deletes a session by sessionId.
 */
function handleDeleteSession(sessionId) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;
  const data = JSON.stringify({ session_id: sessionId });

  return getAuthenticatedHttpClient().delete(
    `${apiV2BaseUrl}/sessions/`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    },
  );
}

/**
 * Enrolls a student into a session (cascades across constituent classes).
 */
function enrollStudentToSession(data) {
  const apiV2BaseUrl = getConfig().COURSE_OPERATIONS_API_V2_BASE_URL;

  return getAuthenticatedHttpClient().post(
    `${apiV2BaseUrl}/offering-runs/${data.offeringRunId}/enrollments/`,
    data,
  );
}

export {
  getSessionsByOffering,
  handleNewSession,
  handleEditSession,
  handleDeleteSession,
  enrollStudentToSession,
  getSessionDetail,
  getAllSessions,
};
