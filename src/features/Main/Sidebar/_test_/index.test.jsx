import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Sidebar } from 'features/Main/Sidebar';
import '@testing-library/jest-dom/extend-expect';
import { initializeStore } from 'store';

let store;

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {
      pathname: '/',
    },
  }),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    store = initializeStore();
  });

  it('should render properly', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <Sidebar />
      </Provider>,
    );

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();

    fireEvent.click(studentsTabButton);
    expect(studentsTabButton).toHaveClass('active');

    expect(mockHistoryPush).toHaveBeenCalledWith('/students');
  });
});
