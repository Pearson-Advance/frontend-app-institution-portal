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

/**
 * Generic hook to manage form input state, including nested fields.
 *
 * @template T
 * @param {T} initialState - The initial state of the form.
 * @returns {{
*   formState: T,
*   setFormState: React.Dispatch<React.SetStateAction<T>>,
*   handleInputChange: (
*     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string, value: any },
*     formSectionKey?: keyof T
*   ) => void,
*   resetFormState: () => void
* }}
*/
export function useFormInput(initialState = {}) {
  const [formState, setFormState] = useState(initialState);

  const resetFormState = () => setFormState(initialState);

  /**
  * Handles input changes and updates the form state.
  *
  * @param {React.ChangeEvent<HTMLInputElement
  * | HTMLTextAreaElement> | { name: string, value: any }} e - The input change event or custom object.
  * @param {keyof T} [formSectionKey] - Optional key for nested objects within the form state.
  */
  const handleInputChange = (e, formSectionKey = null) => {
    const isEvent = e?.target !== undefined;

    let name;
    let value;

    if (isEvent) {
      const {
        type,
        name: inputName,
        value: inputValue,
        checked,
      } = e.target;

      name = inputName;
      value = type === 'checkbox' ? checked : inputValue;
    } else {
      name = e.name;
      value = e.value;
    }

    if (!name) { return; }

    if (formSectionKey) {
      setFormState(prev => ({
        ...prev,
        [formSectionKey]: {
          ...prev[formSectionKey],
          [name]: value,
        },
      }));

      return;
    }

    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    formState,
    handleInputChange,
    resetFormState,
  };
}
