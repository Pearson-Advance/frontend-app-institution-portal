import React from 'react';
import axios from 'axios';
import { render, waitFor } from '@testing-library/react';
import LicensesPage from 'features/Licenses/LicensesPage';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { initializeStore } from 'store';

let store;

jest.mock('axios');

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockResponse = {
  data: {
    results: [
      {
        licenseName: 'License Name 1',
        purchasedSeats: 20,
        numberOfStudents: 6,
        numberOfPendingStudents: 11,
      },
      {
        licenseName: 'License Name 2',
        purchasedSeats: 10,
        numberOfStudents: 1,
        numberOfPendingStudents: 5,
      },
    ],
    count: 2,
    num_pages: 1,
    current_page: 1,
  },
};

describe('LicensesPage component', () => {
  beforeEach(() => {
    store = initializeStore();
  });

  test('renders licenses data components', () => {
    axios.get.mockResolvedValue(mockResponse);

    const component = render(
      <Provider store={store}>
        <LicensesPage />
      </Provider>,
    );

    waitFor(() => {
      expect(component.container).toHaveTextContent('License Pool');
      expect(component.container).toHaveTextContent('License Name 1');
      expect(component.container).toHaveTextContent('License Name 2');
      expect(component.container).toHaveTextContent('Purchased');
      expect(component.container).toHaveTextContent('20');
      expect(component.container).toHaveTextContent('10');
      expect(component.container).toHaveTextContent('Enrolled');
      expect(component.container).toHaveTextContent('6');
      expect(component.container).toHaveTextContent('1');
      expect(component.container).toHaveTextContent('Remaining');
      expect(component.container).toHaveTextContent('11');
      expect(component.container).toHaveTextContent('5');
    });
  });
});
