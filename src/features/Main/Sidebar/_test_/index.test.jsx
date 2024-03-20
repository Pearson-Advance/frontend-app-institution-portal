import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Sidebar } from 'features/Main/Sidebar';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';

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
  it('should render properly', () => {
    const { getByRole } = renderWithProviders(
      <Sidebar />,
    );

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();

    fireEvent.click(studentsTabButton);
    expect(studentsTabButton).toHaveClass('active');

    expect(mockHistoryPush).toHaveBeenCalledWith('/students');
  });
});
