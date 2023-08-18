import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import Main from 'features/Main';
import '@testing-library/jest-dom/extend-expect';

describe('Main component', () => {
  const authenticatedUser = {
    username: 'User',
  };
  const config = {
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
    LMS_BASE_URL: 'http://localhost:18000',
  };

  const { getByRole, getByText } = render(
    <AppContext.Provider value={{ authenticatedUser, config }}>
      <Main />
    </AppContext.Provider>,
  );

  it('toggles account menu on button click (Header)', () => {
    const institutionName = getByText('Institution');
    const avatar = getByText('U');

    expect(institutionName).toBeInTheDocument();
    expect(avatar).toBeInTheDocument();

    const button = getByRole('button', { expanded: false });
    fireEvent.click(button);

    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toBeInTheDocument();
    expect(logOutLink).toBeInTheDocument();
  });

  it('Should render Sidebar', () => {
    render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Main />
      </AppContext.Provider>,
    );

    const studentsTabButton = getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();

    fireEvent.click(studentsTabButton);
    expect(studentsTabButton).toHaveClass('active');
  });

  it('should render two footer links', () => {
    render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Main />
      </AppContext.Provider>,
    );

    const linkPrivacyPolicy = getByText('Privacy Policy');
    expect(linkPrivacyPolicy).toBeInTheDocument();

    const linkTermsOfService = getByText('Terms of Service');
    expect(linkTermsOfService).toBeInTheDocument();
  });
});
