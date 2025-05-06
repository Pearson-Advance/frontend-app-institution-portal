import { useSelector } from 'react-redux';
import { useState } from 'react';

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
