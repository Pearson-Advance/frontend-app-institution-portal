import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { initializeStore } from 'store';

export const executeThunk = async (thunk, dispatch, getState) => {
  await thunk(dispatch, getState);
};

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = initializeStore(preloadedState),
    ...renderOptions
  } = {},
) {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
