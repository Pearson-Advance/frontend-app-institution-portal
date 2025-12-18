import { useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Dropdown, Toast, useToggle } from '@edx/paragon';

import { assignVoucher, revokeVoucher } from 'features/Courses/data/api';
import {
  VOUCHER_ACTIONS,
  HTTP_STATUS,
  VOUCHER_SUCCESS_MESSAGES,
  VOUCHER_ERROR_MESSAGES,
  VOUCHER_UI_LABELS,
} from 'features/constants';

const initialState = {
  assignLoading: false,
  revokeLoading: false,
  message: '',
};

function reducer(state, action) {
  switch (action.type) {
    case VOUCHER_ACTIONS.ASSIGN_START:
      return { ...state, assignLoading: true };
    case VOUCHER_ACTIONS.ASSIGN_END:
      return { ...state, assignLoading: false };
    case VOUCHER_ACTIONS.REVOKE_START:
      return { ...state, revokeLoading: true };
    case VOUCHER_ACTIONS.REVOKE_END:
      return { ...state, revokeLoading: false };
    case VOUCHER_ACTIONS.SET_MESSAGE:
      return { ...state, message: action.payload };
    default:
      return state;
  }
}

const VoucherOptions = ({
  courseId, learnerEmail, showAssign, showRevoke,
}) => {
  const enableOption = getConfig().PSS_ENABLE_ASSIGN_VOUCHER || false;
  const institution = useSelector((state) => state.main.selectedInstitution);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [showToast, openToast, closeToast] = useToggle(false);

  const { assignLoading, revokeLoading, message } = state;

  const invalidInputs = useMemo(
    () => !courseId || !learnerEmail || !institution?.id || !institution?.uuid,
    [courseId, learnerEmail, institution.id, institution.uuid],
  );

  const makePayload = useCallback(() => ({
    institution_id: institution.id,
    institution_uuid: institution.uuid,
    course_id: courseId,
    email: learnerEmail,
  }), [institution.id, institution.uuid, courseId, learnerEmail]);

  const showMessage = useCallback(
    (msg) => {
      dispatch({ type: VOUCHER_ACTIONS.SET_MESSAGE, payload: msg });
      openToast();
    },
    [openToast],
  );

  const handleAssignVoucher = useCallback(async () => {
    if (assignLoading || invalidInputs) { return; }

    dispatch({ type: VOUCHER_ACTIONS.ASSIGN_START });

    try {
      const response = await assignVoucher(makePayload());

      if (response?.status === HTTP_STATUS.SUCCESS) {
        showMessage(VOUCHER_SUCCESS_MESSAGES.ASSIGN);
      }
    } catch {
      showMessage(VOUCHER_ERROR_MESSAGES.ASSIGN);
    } finally {
      dispatch({ type: VOUCHER_ACTIONS.ASSIGN_END });
    }
  }, [assignLoading, invalidInputs, makePayload, showMessage]);

  const handleRevokeVoucher = useCallback(async () => {
    if (revokeLoading || invalidInputs) { return; }

    dispatch({ type: VOUCHER_ACTIONS.REVOKE_START });

    try {
      const response = await revokeVoucher(makePayload());

      if (response?.status === HTTP_STATUS.SUCCESS) {
        showMessage(VOUCHER_SUCCESS_MESSAGES.REVOKE);
      }
    } catch (error) {
      const status = error?.customAttributes?.httpErrorStatus;

      if (status === HTTP_STATUS.NOT_FOUND) {
        showMessage(VOUCHER_ERROR_MESSAGES.NOT_FOUND);
        dispatch({ type: VOUCHER_ACTIONS.REVOKE_END });
        return;
      }

      if (status === HTTP_STATUS.UNPROCESSABLE) {
        showMessage(VOUCHER_ERROR_MESSAGES.UNPROCESSABLE);
        dispatch({ type: VOUCHER_ACTIONS.REVOKE_END });
        return;
      }

      showMessage(VOUCHER_ERROR_MESSAGES.REVOKE);
    } finally {
      dispatch({ type: VOUCHER_ACTIONS.REVOKE_END });
    }
  }, [revokeLoading, invalidInputs, makePayload, showMessage]);

  if (!enableOption) { return null; }

  return (
    <>
      {showAssign && (
      <Dropdown.Item
        className={`text-truncate text-decoration-none custom-text-black ${assignLoading ? 'opacity-50' : ''}`}
        onClick={handleAssignVoucher}
        disabled={assignLoading}
      >
        <i className="fa-solid fa-ticket mr-2" />
        {assignLoading ? VOUCHER_UI_LABELS.ASSIGNING : VOUCHER_UI_LABELS.ASSIGN}
      </Dropdown.Item>
      )}

      {showRevoke && (
      <Dropdown.Item
        className={`text-truncate text-decoration-none text-danger ${revokeLoading ? 'opacity-50' : ''}`}
        onClick={handleRevokeVoucher}
        disabled={revokeLoading}
      >
        <i className="fa-solid fa-trash mr-2" />
        {revokeLoading ? VOUCHER_UI_LABELS.REVOKING : VOUCHER_UI_LABELS.REVOKE}
      </Dropdown.Item>
      )}

      <Toast
        onClose={closeToast}
        show={showToast}
        className="toast-message"
        data-testid="toast-message"
      >
        {message}
      </Toast>
    </>
  );
};

VoucherOptions.propTypes = {
  courseId: PropTypes.string.isRequired,
  learnerEmail: PropTypes.string.isRequired,
  showAssign: PropTypes.bool.isRequired,
  showRevoke: PropTypes.bool.isRequired,
};

export default VoucherOptions;
