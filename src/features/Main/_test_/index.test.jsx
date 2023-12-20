import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import Main from 'features/Main';
import '@testing-library/jest-dom/extend-expect';

jest.mock('features/Students/StudentsPage');
jest.mock('features/Students/data/api');
jest.mock('features/Main/data/api');
jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('Main component', () => {
  const authenticatedUser = {
    username: 'User',
  };
  const config = {
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
    LMS_BASE_URL: 'http://localhost:18000',
  };

  it('toggles account menu on button click (Header)', () => {
    const { getByText } = render(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Main />
      </AppContext.Provider>,
    );

    expect(getByText('No Institution Found')).toBeInTheDocument();

    const button = screen.getByRole('button', { expanded: false });
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

    const studentsTabButton = screen.getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();
  });

  it('should render two footer links', () => {
    const { getByText } = render(
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
