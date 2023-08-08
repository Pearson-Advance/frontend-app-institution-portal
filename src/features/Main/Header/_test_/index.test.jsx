import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import { Header } from 'features/Main/Header';
import '@testing-library/jest-dom/extend-expect';

describe('Header', () => {
  const authenticatedUser = {
    username: 'User',
  };
  const config = {
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
    LMS_BASE_URL: 'http://localhost:18000',
  };

  it('renders header correctly', () => {
    const setIsAccountMenuOpen = jest.fn();
    const { getByText } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header isAccountMenuOpen={false} setIsAccountMenuOpen={setIsAccountMenuOpen} />
      </AppContext.Provider>,
    );

    const institutionName = getByText('Institution');
    const avatar = getByText('U');

    expect(institutionName).toBeInTheDocument();
    expect(avatar).toBeInTheDocument();
  });

  it('toggles account menu on button click', () => {
    const setIsAccountMenuOpen = jest.fn();
    const { getByRole } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header isAccountMenuOpen={false} setIsAccountMenuOpen={setIsAccountMenuOpen} />
      </AppContext.Provider>,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(setIsAccountMenuOpen).toHaveBeenCalledTimes(1);
    expect(setIsAccountMenuOpen).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should have correct href attributes for the links', () => {
    const setIsAccountMenuOpen = jest.fn();
    const { getByText } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header isAccountMenuOpen setIsAccountMenuOpen={setIsAccountMenuOpen} />
      </AppContext.Provider>,
    );

    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toHaveAttribute('href', `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`);
    expect(logOutLink).toHaveAttribute('href', `${config.LMS_BASE_URL}/logout`);
  });
});
