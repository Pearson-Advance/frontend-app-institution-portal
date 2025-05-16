import { renderHook, act } from '@testing-library/react-hooks';

import { renderWithProviders } from 'test-utils';
import {
  useInstitutionIdQueryParam,
  useToast,
  useFormInput,
} from 'hooks';
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

describe('useToast', () => {
  test('Should initialize with default toast state', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.message).toBe('');
  });

  test('Should update toast state when showToast is called', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message');
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.message).toBe('Test message');
  });

  test('Should reset toast state when hideToast is called', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message');
    });

    act(() => {
      result.current.hideToast();
    });

    expect(result.current.isVisible).toBe(false);
    expect(result.current.message).toBe('');
  });
});

describe('useFormInput', () => {
  const initialState = {
    name: '',
    email: '',
    settings: {
      newsletter: false,
    },
  };

  test('should initialize with the given state', () => {
    const { result } = renderHook(() => useFormInput(initialState));
    expect(result.current.formState).toEqual(initialState);
  });

  test('should update simple field from event', () => {
    const { result } = renderHook(() => useFormInput(initialState));

    act(() => {
      result.current.handleInputChange({
        target: { name: 'name', value: 'Sam', type: 'text' },
      });
    });

    expect(result.current.formState.name).toBe('Sam');
  });

  test('should update checkbox field from event', () => {
    const { result } = renderHook(() => useFormInput(initialState));

    act(() => {
      result.current.handleInputChange({
        target: { name: 'newsletter', checked: true, type: 'checkbox' },
      }, 'settings');
    });

    expect(result.current.formState.settings.newsletter).toBe(true);
  });

  test('should update field from custom object', () => {
    const { result } = renderHook(() => useFormInput(initialState));

    act(() => {
      result.current.handleInputChange({ name: 'email', value: 'test@example.com' });
    });

    expect(result.current.formState.email).toBe('test@example.com');
  });

  test('should reset form state', () => {
    const { result } = renderHook(() => useFormInput(initialState));

    act(() => {
      result.current.handleInputChange({ name: 'name', value: 'Sam' });
    });

    act(() => {
      result.current.resetFormState();
    });

    expect(result.current.formState).toEqual(initialState);
  });

  test('should not update state if event has no name', () => {
    const { result } = renderHook(() => useFormInput(initialState));

    act(() => {
      result.current.handleInputChange({
        target: { value: 'value', type: 'text' },
      });
    });

    expect(result.current.formState).toEqual(initialState);
  });

  test('should not update state if custom object has no name', () => {
    const { result } = renderHook(() => useFormInput(initialState));

    act(() => {
      result.current.handleInputChange({ value: 'value' });
    });

    expect(result.current.formState).toEqual(initialState);
  });

  test('should handle falsy or null event gracefully', () => {
    const { result } = renderHook(() => useFormInput(initialState));

    act(() => {
      result.current.handleInputChange(null);
    });

    expect(result.current.formState).toEqual(initialState);
  });
});
