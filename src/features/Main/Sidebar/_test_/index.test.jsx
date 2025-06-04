import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Sidebar } from 'features/Main/Sidebar';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import * as paragonTopaz from 'react-paragon-topaz';

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

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    INSTRUCTOR_PORTAL_PATH: 'https://instructor.example.com',
  })),
}));

jest.mock('react-paragon-topaz', () => ({
  ...jest.requireActual('react-paragon-topaz'),
  getUserRoles: jest.fn(() => (['INSTITUTION_ADMIN'])),
}));

describe('Sidebar', () => {
  test('should render properly', () => {
    const { getByRole } = renderWithProviders(
      <Sidebar />,
    );

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();

    fireEvent.click(studentsTabButton);
    expect(studentsTabButton).toHaveClass('active');

    expect(mockHistoryPush).toHaveBeenCalledWith('/students');
  });

  test('should render Instructor Portal item if has role', () => {
    paragonTopaz.getUserRoles.mockReturnValue(['INSTRUCTOR', 'INSTITUTION_ADMIN']);

    const { getByText } = renderWithProviders(
      <Sidebar />,
    );

    const portalLink = getByText('Instructor Portal');

    expect(portalLink).toBeInTheDocument();
  });
});
