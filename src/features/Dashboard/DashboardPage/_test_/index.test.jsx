import React from 'react';
import { render } from '@testing-library/react';
import DashboardPage from 'features/Dashboard/DashboardPage';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { initializeStore } from 'store';

let store;

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('DashboardPage component', () => {
  beforeEach(() => {
    store = initializeStore();
  });
  test('renders components', () => {
    const { getByText } = render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>,
    );

    expect(getByText('This week')).toBeInTheDocument();
    expect(getByText('Next week')).toBeInTheDocument();
    expect(getByText('Next month')).toBeInTheDocument();
    expect(getByText('New students registered')).toBeInTheDocument();
    expect(getByText('Classes scheduled')).toBeInTheDocument();
    expect(getByText('License inventory')).toBeInTheDocument();
  });
});
