import { useSelector } from 'react-redux';

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
