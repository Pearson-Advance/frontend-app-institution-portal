import { useSelector } from 'react-redux';
import { useState } from 'react';
import { getConfig } from '@edx/frontend-platform';

import { INSTITUTION_QUERY_ID } from 'features/constants';

export const useInstitutionIdQueryParam = () => {
  const institutionId = useSelector((state) => state.main.selectedInstitution?.id);

  const addQueryParam = (url) => {
    if (!institutionId) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${INSTITUTION_QUERY_ID}=${institutionId}`;
  };

  return addQueryParam;
};

/**
 * Controls visibility of the Programs feature (nav items + routes).
 *
 * Visible only when the `PSS_ENABLE_OFFERINGS` feature flag is on AND the backend
 * reports the selected institution with `has_offerings` enabled.
 *
 * @returns {boolean} Whether the Programs feature should be exposed.
 */
export const useProgramsAccess = () => {
  const selectedInstitution = useSelector((state) => state.main.selectedInstitution);
  const isFlagEnabled = Boolean(getConfig().PSS_ENABLE_OFFERINGS);

  return isFlagEnabled && Boolean(selectedInstitution?.hasOfferings);
};

/**
 * Custom hook to manage toast notifications
 * @returns {Object} Toast state and methods
 */
export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
  });

  const showToast = (message) => {
    setToast({
      isVisible: true,
      message,
    });
  };

  const hideToast = () => {
    setToast({
      isVisible: false,
      message: '',
    });
  };

  return {
    isVisible: toast.isVisible,
    message: toast.message,
    showToast,
    hideToast,
  };
};
