import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
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

  it('renders header correctly with "Institution Name"', async () => {
    let getByText;

    await act(async () => {
      const renderResult = render(
        <AppContext.Provider value={{ authenticatedUser, config }}>
          <Header />
        </AppContext.Provider>,
      );

      getByText = renderResult.getByText;
    });
    expect(getByText('User')).toBeInTheDocument();
  });

  it('renders header correctly', () => {
    const { getByText } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const titleApp = getByText('CertPREP Training Center Dashboard');
    const userName = getByText('User');

    expect(userName).toBeInTheDocument();
    expect(titleApp).toBeInTheDocument();
  });

  it('toggles account menu on button click', () => {
    const { getByRole, getByText } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toBeInTheDocument();
    expect(logOutLink).toBeInTheDocument();
  });

  it('should have correct href attributes for the links', () => {
    const { getByText, getByRole } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const menuButton = getByRole('button');
    fireEvent.click(menuButton);
    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toHaveAttribute('href', `${config.ACCOUNT_PROFILE_URL}/${authenticatedUser.username}`);
    expect(logOutLink).toHaveAttribute('href', `${config.LMS_BASE_URL}/logout`);
  });
});
