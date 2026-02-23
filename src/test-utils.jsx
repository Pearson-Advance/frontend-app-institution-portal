import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { MemoryRouter, Routes } from 'react-router-dom';

import { initializeStore } from 'store';

export const executeThunk = async (thunk, dispatch, getState) => {
  await thunk(dispatch, getState);
};

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    initialEntries = ['/'], // default route
    store = initializeStore(preloadedState),
    ...renderOptions
  } = {},
) {
  const isRouteElement =
    ui?.type?.name === 'Route' || ui?.type?.displayName === 'Route';

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={initialEntries}>
          {isRouteElement ? <Routes>{children}</Routes> : children}
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}