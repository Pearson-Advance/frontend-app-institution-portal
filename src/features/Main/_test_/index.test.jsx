// TODO: this test should be refactor,takes more than half the total time. temporarily disabled
import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import Main from 'features/Main';
import { renderWithProviders } from 'test-utils';

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
    const { getByText } = renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Main />
      </AppContext.Provider>,
    );

    const titleApp = getByText('CertPREP Manager');
    expect(titleApp).toBeInTheDocument();

    const button = screen.getByRole('button', { expanded: false });
    fireEvent.click(button);

    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toBeInTheDocument();
    expect(logOutLink).toBeInTheDocument();
  });
  it('Should render Sidebar', () => {
    renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Main />
      </AppContext.Provider>,
    );

    const studentsTabButton = screen.getByRole('button', { name: /students/i });
    expect(studentsTabButton).toBeInTheDocument();
  });

  it('should render two footer links', () => {
    const { getByText } = renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Main />
      </AppContext.Provider>,
    );

    const linkPrivacyPolicy = getByText('Privacy');
    expect(linkPrivacyPolicy).toBeInTheDocument();

    const linkTermsOfService = getByText('Terms');
    expect(linkTermsOfService).toBeInTheDocument();
  });

  test('Should render cookie consent banner', () => {
    const { container } = renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Main />
      </AppContext.Provider>,
    );

    const cookieText = 'This website uses cookies to ensure you get the best experience on our website.';
    expect(container).toHaveTextContent(cookieText);
  });
});
