import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import StudentsMetrics from 'features/Students/StudentsMetrics';
import '@testing-library/jest-dom/extend-expect';
import { initializeStore } from 'store';

let store;

describe('StudentsMetrics component', () => {
  beforeEach(() => {
    store = initializeStore();
  });

  test('renders components', () => {
    const { getByText } = render(
      <Provider store={store}>
        <StudentsMetrics />
      </Provider>,
    );

    expect(getByText('This week')).toBeInTheDocument();
    expect(getByText('Next week')).toBeInTheDocument();
    expect(getByText('Next month')).toBeInTheDocument();
    expect(getByText('New students registered')).toBeInTheDocument();
    expect(getByText('Classes scheduled')).toBeInTheDocument();
  });
});
