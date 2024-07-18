import { renderHook } from '@testing-library/react-hooks';

import { renderWithProviders } from 'test-utils';
import { useInstitutionIdQueryParam } from 'hooks';
import { INSTITUTION_QUERY_ID } from 'features/constants';

describe('useInstitutionIdQueryParam', () => {
  test('Should return the URL unchanged if institutionId is not defined', () => {
    const preloadedState = {
      main: {
        selectedInstitution: null,
      },
    };

    const { result } = renderHook(() => useInstitutionIdQueryParam(), {
      wrapper: ({ children }) => renderWithProviders(children, { preloadedState }).store,
    });

    expect(result.current('http://example.com')).toBe('http://example.com');
  });

  test('Should add the institutionId as a query param if institutionId is defined', () => {
    const institutionId = '12345';
    const preloadedState = {
      main: {
        selectedInstitution: { id: institutionId },
      },
    };

    const { result } = renderHook(() => useInstitutionIdQueryParam(), {
      wrapper: ({ children }) => renderWithProviders(children, { preloadedState }).store,
    });

    expect(result.current('http://example.com')).toBe(`http://example.com?${INSTITUTION_QUERY_ID}=${institutionId}`);
  });

  test('Should append the institutionId as a query param if other query params exist', () => {
    const institutionId = '12345';
    const preloadedState = {
      main: {
        selectedInstitution: { id: institutionId },
      },
    };

    const { result } = renderHook(() => useInstitutionIdQueryParam(), {
      wrapper: ({ children }) => renderWithProviders(children, { preloadedState }).store,
    });

    expect(result.current('http://example.com?foo=bar')).toBe(`http://example.com?foo=bar&${INSTITUTION_QUERY_ID}=${institutionId}`);
  });
});
