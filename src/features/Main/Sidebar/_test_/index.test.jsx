import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Sidebar } from 'features/Main/Sidebar';
import '@testing-library/jest-dom/extend-expect';

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
    const { getByRole } = render(<Sidebar currentPath="institution-portal" />);

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();

    fireEvent.click(studentsTabButton);
    expect(studentsTabButton).toHaveClass('active');

    expect(mockHistoryPush).toHaveBeenCalledWith('/institution-portal/students');
  });
});
